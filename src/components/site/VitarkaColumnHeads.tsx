const TEAL = "#2E5C52";

function ColHead({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A867E]">{eyebrow}</p>
      <p className="mt-3 text-[15px] leading-[1.55] text-[#1B1F23]">{children}</p>
    </div>
  );
}

export function VitarkaColumnHeads() {
  return (
    <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
      <ColHead eyebrow="Understands before it asks">
        Reads the <span style={{ color: TEAL }}>job</span>, the role and the <span style={{ color: TEAL }}>candidate</span>.
      </ColHead>
      <ColHead eyebrow="Thinks. Adapts. Decides.">
        Not a script.<br />An <span style={{ color: TEAL }}>intelligent</span> interviewer.
      </ColHead>
      <ColHead eyebrow="A conversation that adapts">
        Listens, probes and goes <span style={{ color: TEAL }}>deeper</span>.
      </ColHead>
    </div>
  );
}
