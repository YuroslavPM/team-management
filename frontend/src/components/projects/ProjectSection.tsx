import type { ReactNode } from "react";

type ProjectSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export const ProjectSection = ({
  title,
  action,
  children,
}: ProjectSectionProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between py-4 pr-4">
        <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
          {title}
        </h2>
        {action}
      </div>

      {children}
    </section>
  );
};
