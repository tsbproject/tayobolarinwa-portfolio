import Container from "@/components/layout/Container";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const metrics = [
  {
    key: "performance",
    label: "Performance",
  },
  {
    key: "seo",
    label: "SEO",
  },
  {
    key: "accessibility",
    label: "Accessibility",
  },
] as const;

export default function ProductMetrics({
  product,
}: Props) {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12">
          <h2 className="heading text-4xl font-bold">
            Performance Metrics
          </h2>

          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Measured against modern web standards with a focus on
            speed, accessibility, SEO and overall user experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"
            >
              <div className="text-6xl font-bold text-blue-600">
                {product.metrics[metric.key]}
              </div>

              <p className="mt-4 text-lg font-semibold">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}