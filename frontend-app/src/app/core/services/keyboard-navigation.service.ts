import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  private listenerActive = false;

  init() {
    if (this.listenerActive) return;

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.handleKeyDown(event);
    });

    this.listenerActive = true;
    console.log('⌨️ KeyboardNavigationService initialized and listening globally.');
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Avoid capturing keys when the user is typing in inputs or editable elements
    const activeEl = document.activeElement;
    if (
      activeEl instanceof HTMLInputElement ||
      activeEl instanceof HTMLTextAreaElement ||
      (activeEl as HTMLElement)?.isContentEditable
    ) {
      return;
    }

    // Never hijack keys while the user is interacting with the Foco tutor chat
    // panel (Ensayo PAES asistido). Even when focus has slipped off the chat
    // textarea — right after sending a message, while Foco is "thinking", or
    // after reading a reply — pressing keys near that panel must not navigate
    // questions.
    if ((activeEl as HTMLElement)?.closest?.('.ai-panel')) {
      return;
    }

    const key = event.key.toLowerCase();

    // Fetch shortcuts from localStorage (fall back to default keys)
    const keyA = localStorage.getItem('KEY_SHORTCUT_A') || 'z';
    const keyB = localStorage.getItem('KEY_SHORTCUT_B') || 'x';
    const keyC = localStorage.getItem('KEY_SHORTCUT_C') || 'c';
    const keyD = localStorage.getItem('KEY_SHORTCUT_D') || 'v';
    const keyE = localStorage.getItem('KEY_SHORTCUT_E') || 'b';
    // 'enter' is never accepted as the "next question" shortcut: it's the key
    // most likely to be pressed by accident (right after answering, resting on
    // the keyboard, or while chatting with the Foco tutor) and it was silently
    // skipping to the next question. Any stored/legacy 'enter' is treated as the
    // default arrow key instead.
    const storedNext = localStorage.getItem('KEY_SHORTCUT_NEXT') || 'arrowright';
    const keyNext = storedNext === 'enter' ? 'arrowright' : storedNext;
    const keyPrev = localStorage.getItem('KEY_SHORTCUT_PREV') || 'arrowleft';
    const keyExit = localStorage.getItem('KEY_SHORTCUT_EXIT') || 'escape';

    // 1. Answer Options Selection (A, B, C, D, E)
    // Supports custom configuration AND classic selectors (1-5, z-b) simultaneously
    if (key === keyA || key === '1' || key === 'z') {
      event.preventDefault();
      this.clickOptionByLetter('A');
    } else if (key === keyB || key === '2' || key === 'x') {
      event.preventDefault();
      this.clickOptionByLetter('B');
    } else if (key === keyC || key === '3' || key === 'c') {
      event.preventDefault();
      this.clickOptionByLetter('C');
    } else if (key === keyD || key === '4' || key === 'v') {
      event.preventDefault();
      this.clickOptionByLetter('D');
    } else if (key === keyE || key === '5' || key === 'b') {
      event.preventDefault();
      this.clickOptionByLetter('E');
    }

    // 2. Next / Submit / Confirm navigation (supports custom key, spacebar, or arrowright —
    // 'enter' is deliberately excluded, see keyNext above)
    else if ((key === keyNext && key !== 'enter') || key === 'arrowright' || key === ' ' || key === 'spacebar') {
      // Avoid preventing default on Space when focusing on clickable elements natively
      if ((key === ' ' || key === 'spacebar') && activeEl instanceof HTMLButtonElement) {
        return;
      }
      event.preventDefault();
      this.clickNextButton();
    }

    // 3. Arrow navigation / Go Back (supports custom key, default arrowleft, and ArrowUp/Down for scroll)
    else if (key === keyPrev || key === 'arrowleft') {
      event.preventDefault();
      this.clickPrevButton();
    } else if (key === keyExit || key === 'escape') {
      event.preventDefault();
      this.clickExitButton();
    } else if (key === 'arrowup') {
      event.preventDefault();
      this.scrollSmoothly(-120);
    } else if (key === 'arrowdown') {
      event.preventDefault();
      this.scrollSmoothly(120);
    }
  }

  private clickOptionByLetter(letter: 'A' | 'B' | 'C' | 'D' | 'E') {
    const optionButtons = document.querySelectorAll('.option-btn');
    if (optionButtons.length === 0) return;

    for (let i = 0; i < optionButtons.length; i++) {
      const btn = optionButtons[i] as HTMLElement;
      if (btn.offsetParent === null) continue; // Skip hidden buttons

      // Try matching by .opt-letter inner content
      const letterSpan = btn.querySelector('.opt-letter');
      if (letterSpan) {
        const text = letterSpan.textContent?.trim().toUpperCase();
        if (text === letter) {
          btn.click();
          return;
        }
      }

      // Fallback matching by element index (A -> 0, B -> 1, C -> 2, D -> 3, E -> 4)
      const letterIndex = letter.charCodeAt(0) - 65; // A is 65
      if (i === letterIndex) {
        btn.click();
        return;
      }
    }
  }

  private clickNextButton() {
    // Priority 1: Primary Answer checks / navigation forward buttons
    const primarySelectors = [
      '.btn-check',
      '.btn-next',
      '.btn-nav-inline.primary', // for Ensayo PAES next button
      '.btn-nav.btn-primary',    // for Mini Ensayo PAES next button
      '.bottom-bar button:not(.btn-secondary):not(.btn-back)'
    ];

    for (const selector of primarySelectors) {
      const buttons = document.querySelectorAll(selector);
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i] as HTMLElement;
        const text = btn.textContent?.toLowerCase() || '';

        // Ignore finish/back/pause triggers in this pass
        if (
          text.includes('finalizar') ||
          text.includes('terminar') ||
          text.includes('anterior') ||
          text.includes('volver') ||
          text.includes('pausar') ||
          btn.classList.contains('btn-secondary') ||
          btn.classList.contains('btn-back') ||
          btn.classList.contains('btn-finish')
        ) {
          continue;
        }

        if (btn.offsetParent !== null && !(btn as HTMLButtonElement).disabled) {
          btn.click();
          return;
        }
      }
    }

    // Priority 2: Submission/End Exam buttons when no primary forward triggers exist
    const finishSelectors = [
      '.btn-finish',
      '.btn-nav-inline.success', // for Ensayo PAES finish button
      '.btn-nav.btn-primary',    // for Mini Ensayo PAES finish button
      '.btn-start-game',
      '.btn-primary-lg',
      '.bottom-bar button'
    ];

    for (const selector of finishSelectors) {
      const buttons = document.querySelectorAll(selector);
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i] as HTMLElement;
        const text = btn.textContent?.toLowerCase() || '';

        if (
          btn.classList.contains('btn-secondary') ||
          btn.classList.contains('btn-back') ||
          text.includes('anterior') ||
          text.includes('volver')
        ) {
          continue;
        }

        // Safety filter: Ignore sidebar finish buttons (.btn-finish inside aside elements)
        // to prevent premature submissions in Mini Ensayos
        if (btn.classList.contains('btn-finish') && btn.closest('aside')) {
          continue;
        }

        if (btn.offsetParent !== null && !(btn as HTMLButtonElement).disabled) {
          btn.click();
          return;
        }
      }
    }
  }

  private clickPrevButton() {
    const prevSelectors = [
      '.btn-secondary',
      '.btn-back',
      '.btn-nav-inline', // for Ensayo PAES anterior button
      '.btn-nav'        // for Mini Ensayo PAES anterior button
    ];

    for (const selector of prevSelectors) {
      const prevButtons = document.querySelectorAll(selector);
      for (let i = 0; i < prevButtons.length; i++) {
        const btn = prevButtons[i] as HTMLElement;
        
        if (btn.offsetParent !== null && !(btn as HTMLButtonElement).disabled) {
          const text = btn.textContent?.toLowerCase() || '';
          // Ensure it represents going back (not cancel/modal close actions)
          if (text.includes('anterior') || text.includes('←')) {
            btn.click();
            return;
          }
        }
      }
    }
  }

  private clickExitButton() {
    const exitSelectors = [
      '.btn-close',
      '.panel-close-btn',
      '.logout-close-btn',
      '.btn-cancel',
      '.btn-secondary-modal',
      '.panel-close-btn-ai',
      '.close-modal'
    ];

    for (const selector of exitSelectors) {
      const exitButtons = document.querySelectorAll(selector);
      for (let i = 0; i < exitButtons.length; i++) {
        const btn = exitButtons[i] as HTMLElement;
        if (btn.offsetParent !== null) {
          btn.click();
          return;
        }
      }
    }
  }

  private scrollSmoothly(amount: number) {
    // Try scrolling scrollable containers first, then window
    const containers = document.querySelectorAll('.main-content, .runner-page, .question-area');
    let scrolled = false;

    for (let i = 0; i < containers.length; i++) {
      const container = containers[i] as HTMLElement;
      if (container.offsetParent !== null && container.scrollHeight > container.clientHeight) {
        container.scrollBy({
          top: amount,
          behavior: 'smooth'
        });
        scrolled = true;
        break;
      }
    }

    if (!scrolled) {
      window.scrollBy({
        top: amount,
        behavior: 'smooth'
      });
    }
  }
}
