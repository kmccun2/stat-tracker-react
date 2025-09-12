import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
}) => {
  return (
    <div className="page-header">
      <div className="icon-wrapper">{icon}</div>
      <div className="title-and-subtitle">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="actions-wrapper">{actions}</div>
    </div>
  );
};

export default PageHeader;
