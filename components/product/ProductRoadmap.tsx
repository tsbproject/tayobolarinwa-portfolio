import Container from "@/components/layout/Container";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductRoadmap({ product }: Props) {
  if (!product.roadmap?.length) return null;

  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <div className="max-w-3xl">
          <h2 className="heading text-4xl font-bold">
            Development Roadmap
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            This roadmap highlights the major development milestones and
            current progress of the product.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {product.roadmap.map((item) => (
            <div
              key={item.phase}
              className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-8"
            >
              <div>
                {item.status === "completed" && (
                  <CheckCircle2 className="text-green-600" size={28} />
                )}

                {item.status === "current" && (
                  <Clock3 className="text-amber-500" size={28} />
                )}

                {item.status === "planned" && (
                  <Circle className="text-slate-400" size={28} />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  {item.phase}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-2 text-slate-600 capitalize">
                  {item.status.replace("-", " ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}