// Donut chart okupansi kamar — SVG murni tanpa dependency, aman dipakai di server component.

interface OkupansiDonutProps {
    terisi: number;
    kosong: number;
    perbaikan: number;
}

const SEGMENTS = [
    { key: "terisi", label: "Terisi", color: "#2F6BFF" },
    { key: "kosong", label: "Kosong", color: "#16A572" },
    { key: "perbaikan", label: "Perbaikan", color: "#F2A50C" },
] as const;

export default function OkupansiDonut({ terisi, kosong, perbaikan }: OkupansiDonutProps) {
    const counts: Record<string, number> = { terisi, kosong, perbaikan };
    const total = terisi + kosong + perbaikan;

    const size = 168;
    const strokeWidth = 20;
    const r = (size - strokeWidth) / 2;
    const C = 2 * Math.PI * r;
    const center = size / 2;

    const occupancyRate = total > 0 ? Math.round((terisi / total) * 100) : 0;

    // Bangun tiap segmen donut. Tiap busur diputar sebesar sudut kumulatif sebelumnya
    // (dikurangi 90° agar mulai dari atas), menghindari kerumitan strokeDashoffset.
    const fractions = SEGMENTS.map((seg) => (total > 0 ? counts[seg.key] / total : 0));
    const arcs = SEGMENTS.map((seg, i) => {
        const startFraction = fractions.slice(0, i).reduce((sum, f) => sum + f, 0);
        return {
            color: seg.color,
            dash: fractions[i] * C,
            startAngle: startFraction * 360 - 90,
        };
    }).filter((a) => a.dash > 0);

    return (
        <div className="flex flex-col items-center gap-5">
            {/* Donut */}
            <div className="relative shrink-0" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Track latar */}
                    <circle cx={center} cy={center} r={r} fill="none" stroke="#EEF1F6" strokeWidth={strokeWidth} />
                    {/* Segmen */}
                    {arcs.map((arc, i) => (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={r}
                            fill="none"
                            stroke={arc.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${arc.dash} ${C - arc.dash}`}
                            transform={`rotate(${arc.startAngle} ${center} ${center})`}
                        />
                    ))}
                </svg>
                {/* Label tengah */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold tracking-tight text-[#0E1424]">{occupancyRate}%</span>
                    <span className="text-[11px] font-semibold text-[#7B8597]">
                        {total > 0 ? "Tingkat Hunian" : "Belum ada kamar"}
                    </span>
                </div>
            </div>

            {/* Legend */}
            <div className="w-full max-w-[240px] space-y-2.5">
                {SEGMENTS.map((seg) => (
                    <div key={seg.key} className="flex items-center justify-between gap-6">
                        <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                            <span className="text-sm font-medium text-[#5A6477]">{seg.label}</span>
                        </span>
                        <span className="text-sm font-extrabold text-[#0E1424]">{counts[seg.key]}</span>
                    </div>
                ))}
                <div className="mt-1 flex items-center justify-between gap-6 border-t border-[#EAEDF3] pt-2.5">
                    <span className="text-sm font-medium text-[#5A6477]">Total Kamar</span>
                    <span className="text-sm font-extrabold text-[#0E1424]">{total}</span>
                </div>
            </div>
        </div>
    );
}
