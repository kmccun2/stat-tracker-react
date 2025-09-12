// Styles
import "./PageHeader.scss";
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
      <div className="d-flex">
        <div className="icon-wrapper d-flex align-items-center">{icon}</div>
        <div className="d-flex flex-column title-and-subtitle">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="actions-wrapper">{actions}</div>
      </div>
      <div></div>
    </div>
  );
};

export default PageHeader;
