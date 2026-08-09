import { CAPITULOS } from "./frontend-app/src/app/features/learning-path/data/seed-data";

const cap1 = CAPITULOS.find(c => c.id === 'cap-1');
for (const sec of cap1.secciones) {
    console.log(`${sec.id}: level=${sec.level}, order=${sec.order}`);
}
