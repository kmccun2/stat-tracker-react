// Styles
import "./PageHeader.scss";
import React, { ReactNode, memo } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = memo(
  ({ title, subtitle, icon, actions }) => {
    return (
      <div className="page-header">
        <div className="d-flex w-100">
          <div className="icon-wrapper d-flex align-items-center">{icon}</div>
          <div className="title-and-subtitle">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="actions-wrapper">{actions}</div>
        </div>
        <div></div>
      </div>
    );
  }
);

// Add display name for debugging
PageHeader.displayName = "PageHeader";

export default PageHeader;
