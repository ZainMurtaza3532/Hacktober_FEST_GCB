import confetti from 'canvas-confetti';

/**
 * Triggers a multi-burst celebratory confetti explosion.
 */
export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Realistic multi-stage burst
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#818cf8', '#34d399', '#fbbf24', '#f472b6'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#6366f1', '#10b981', '#a855f7'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#f43f5e', '#eab308', '#06b6d4'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#10b981', '#6366f1', '#38bdf8'],
  });
}
