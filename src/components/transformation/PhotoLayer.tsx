import type { Pair } from "../../data/projects";

type Props = {
  pair: Pair;
  roomLabel: string;
  layerIndex: number;
  eager?: boolean;
};

/**
 * One real before/after photo pair rendered as two full-bleed 3D-transform
 * planes (`.tf-before` on top, `.tf-after` underneath). No fabricated
 * geometry, furniture, or masks — just the actual jobsite/finished
 * photographs, positioned so a parent GSAP timeline can swing the BEFORE
 * plane away in perspective and let the AFTER plane settle into frame
 * beneath it (see TransformationScene). Selectors are scoped per layer via
 * `data-layer` so a "layered" project can drive two real photo pairs on
 * independent, staggered timelines.
 */
export function PhotoLayer({ pair, roomLabel, layerIndex, eager = false }: Props) {
  const [bw, bh] = pair.beforeDim;
  const [aw, ah] = pair.afterDim;

  return (
    <div className="preserve-3d absolute inset-0" data-layer={layerIndex}>
      <div
        className="tf-after preserve-3d absolute inset-0 z-10"
        style={{ willChange: "transform, opacity" }}
      >
        <img
          src={pair.after}
          alt={`${roomLabel} after renovation by Progetto Build`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ backgroundImage: `url(${pair.afterLQIP})`, backgroundSize: "cover" }}
          width={aw}
          height={ah}
        />
      </div>
      <div
        className="tf-before preserve-3d absolute inset-0 z-20"
        style={{ willChange: "transform, opacity" }}
      >
        <img
          src={pair.before}
          alt={`${roomLabel} before renovation`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ backgroundImage: `url(${pair.beforeLQIP})`, backgroundSize: "cover" }}
          width={bw}
          height={bh}
        />
      </div>
    </div>
  );
}
