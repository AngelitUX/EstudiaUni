import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';
import { ListUsersQueryDto } from './dto/list-users-query.dto';

export interface AdminUserSummary {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: 'free' | 'premium';
  subscriptionStatus: string | null;
  subscriptionEndDate: string | null;
  premiumDaysLeft: number | null;
  isAdmin: boolean;
  emailVerified: boolean | null;
  createdAt: string | null;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Create or update a module.
   */
  async upsertModule(moduleId: string | null, data: any) {
    const db = this.firebaseService.firestore;
    const ref = moduleId
      ? db.collection('modules').doc(moduleId)
      : db.collection('modules').doc();

    await ref.set(data, { merge: true });
    return { id: ref.id, ...data };
  }

  /**
   * Create or update a topic within a module.
   */
  async upsertTopic(moduleId: string, topicId: string | null, data: any) {
    const db = this.firebaseService.firestore;
    const ref = topicId
      ? db.collection('modules').doc(moduleId).collection('topics').doc(topicId)
      : db.collection('modules').doc(moduleId).collection('topics').doc();

    await ref.set(data, { merge: true });
    return { id: ref.id, ...data };
  }

  /**
   * Create or update a question.
   */
  async upsertQuestion(questionId: string | null, data: any) {
    const db = this.firebaseService.firestore;
    const ref = questionId
      ? db.collection('questions').doc(questionId)
      : db.collection('questions').doc();

    await ref.set({ ...data, isActive: true }, { merge: true });
    return { id: ref.id, ...data };
  }

  /**
   * Create a simulation.
   */
  async createSimulation(data: any) {
    const db = this.firebaseService.firestore;
    const ref = db.collection('simulations').doc();
    await ref.set({ ...data, createdAt: new Date() });
    return { id: ref.id, ...data };
  }

  /**
   * Get platform stats.
   */
  async getStats() {
    const db = this.firebaseService.firestore;

    const [users, questions, attempts, modules] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('questions').count().get(),
      db.collection('attempts').count().get(),
      db.collection('modules').count().get(),
    ]);

    return {
      totalUsers: users.data().count,
      totalQuestions: questions.data().count,
      totalAttempts: attempts.data().count,
      totalModules: modules.data().count,
    };
  }

  /**
   * Lista paginada de usuarios para el panel admin (solo lectura).
   *
   * Ordena por FieldPath.documentId() en vez de por `createdAt`: muchas
   * cuentas reales en esta colección no tienen ese campo (se agregó después
   * de que existieran), y Firestore EXCLUYE de un orderBy cualquier
   * documento que no tenga el campo por el que se ordena — con
   * orderBy('createdAt') la mitad de los usuarios simplemente desaparecían
   * de la lista sin ningún error. El id de documento siempre existe, así
   * que ordenar por ahí garantiza que aparezcan todos.
   *
   * El filtro de `plan` se aplica en memoria DESPUÉS de traer la página,
   * usando la misma regla de attachAdminFlag() (plan === 'premium' O
   * subscription.tier === 'premium'), en vez de un `where('plan','==',...)`
   * contra Firestore. Se probó con `where` primero y era incorrecto: varias
   * cuentas reales no tienen el campo `plan` guardado (solo `subscription.
   * tier`), así que Firestore las excluía de `plan == 'free'` aunque la UI
   * las mostrara como "Free" — el filtro y lo que se ve en pantalla deben
   * usar exactamente la misma definición de "plan", no dos independientes.
   * Efecto secundario aceptado: una página filtrada puede traer menos de
   * `limit` resultados (o ninguno) aunque haya más usuarios de ese plan más
   * adelante; `nextCursor` sigue apuntando al siguiente lote sin filtrar,
   * así que "Cargar más" los va encontrando.
   */
  async listUsers(query: ListUsersQueryDto): Promise<{ users: AdminUserSummary[]; nextCursor: string | null }> {
    const db = this.firebaseService.firestore;
    const pageSize = query.limit ?? 25;

    if (query.search) {
      // Búsqueda por prefijo (para autocompletar mientras se escribe), no
      // por igualdad exacta: orderBy('email').startAt(prefix).endAt(prefix +
      // '') es el patrón estándar de Firestore para "empieza con", y
      // al ordenar por el mismo campo que se filtra no necesita índice
      // compuesto (a diferencia de un where en un campo + orderBy en otro).
      const prefix = query.search.trim().toLowerCase();
      const snap = await db
        .collection('users')
        .orderBy('email')
        .startAt(prefix)
        .endAt(prefix + '')
        .limit(pageSize)
        .get();
      return { users: await this.attachAdminFlag(snap.docs), nextCursor: null };
    }

    let q: FirebaseFirestore.Query = db
      .collection('users')
      .orderBy(admin.firestore.FieldPath.documentId())
      .limit(pageSize);

    if (query.cursor) {
      const cursorDoc = await db.collection('users').doc(query.cursor).get();
      if (cursorDoc.exists) {
        q = q.startAfter(cursorDoc);
      }
    }

    const snap = await q.get();
    let users = await this.attachAdminFlag(snap.docs);
    const nextCursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1].id : null;

    if (query.plan && query.plan !== 'all') {
      users = users.filter((u) => u.plan === query.plan);
    }

    return { users, nextCursor };
  }

  private async attachAdminFlag(
    docs: FirebaseFirestore.QueryDocumentSnapshot[],
  ): Promise<AdminUserSummary[]> {
    const db = this.firebaseService.firestore;
    const uids = docs.map((d) => d.id);

    // Firestore `createdAt` no existe en la mayoría de las cuentas reales
    // (se agregó después). Firebase Auth sí guarda la fecha de creación de
    // TODA cuenta automáticamente (metadata.creationTime), así que la
    // usamos como respaldo — batch fetch en una sola llamada en vez de
    // pedirla cuenta por cuenta.
    const [adminDocs, authResult] = await Promise.all([
      Promise.all(uids.map((uid) => db.collection('admins').doc(uid).get())),
      admin.auth().getUsers(uids.map((uid) => ({ uid }))).catch((err) => {
        this.logger.warn(`Could not batch-fetch Auth users for creation dates: ${err.message}`);
        return { users: [] as admin.auth.UserRecord[], notFound: [] };
      }),
    ]);

    const adminSet = new Set(adminDocs.filter((d) => d.exists).map((d) => d.id));
    const authCreationByUid = new Map(
      authResult.users.map((u) => [u.uid, u.metadata.creationTime]),
    );

    return docs.map((doc) => {
      const data = doc.data();
      const plan: 'free' | 'premium' =
        data.plan === 'premium' || data.subscription?.tier === 'premium' ? 'premium' : 'free';
      const subscriptionEndDate = this.toIso(data.subscription?.endDate);
      const authCreationTime = authCreationByUid.get(doc.id);

      return {
        uid: doc.id,
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        photoURL: data.photoURL ?? null,
        plan,
        subscriptionStatus: data.subscription?.status ?? null,
        subscriptionEndDate,
        premiumDaysLeft: this.daysLeft(plan, subscriptionEndDate),
        isAdmin: adminSet.has(doc.id),
        emailVerified: data.emailVerified ?? null,
        createdAt: authCreationTime ? new Date(authCreationTime).toISOString() : this.toIso(data.createdAt),
      };
    });
  }

  private daysLeft(plan: 'free' | 'premium', subscriptionEndDateIso: string | null): number | null {
    if (plan !== 'premium' || !subscriptionEndDateIso) return null;
    const diffMs = new Date(subscriptionEndDateIso).getTime() - Date.now();
    return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
  }

  private toIso(value: any): string | null {
    if (!value) return null;
    if (typeof value.toDate === 'function') return value.toDate().toISOString();
    if (value instanceof Date) return value.toISOString();
    return typeof value === 'string' ? value : null;
  }
}
