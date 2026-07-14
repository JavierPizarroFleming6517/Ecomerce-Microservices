import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { statusCardStyles } from './status-card.styles.js';

export type ServiceStatus = 'operational' | 'degraded' | 'down' | 'unknown';

export interface StatusCardProps
  extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  title: ReactNode;
  status?: ServiceStatus;
  statusLabel?: string;
  value?: ReactNode;
  description?: ReactNode;
}

const DEFAULT_STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
  unknown: 'Unknown',
};

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function StatusCard({
  title,
  status = 'unknown',
  statusLabel,
  value,
  description,
  className,
  ...sectionProps
}: StatusCardProps) {
  const variant = statusCardStyles.variants[status];

  return (
    <section
      className={joinClasses(statusCardStyles.root, className)}
      data-status={status}
      {...sectionProps}
    >
      <div className={statusCardStyles.header}>
        <div>
          <h3 className={statusCardStyles.heading}>{title}</h3>
          {value !== undefined && (
            <div className={statusCardStyles.value}>{value}</div>
          )}
        </div>

        <span
          className={joinClasses(statusCardStyles.badge, variant.badge)}
          role="status"
        >
          <span
            aria-hidden="true"
            className={joinClasses(statusCardStyles.dot, variant.dot)}
          />
          {statusLabel ?? DEFAULT_STATUS_LABELS[status]}
        </span>
      </div>

      {description !== undefined && (
        <p className={statusCardStyles.description}>{description}</p>
      )}
    </section>
  );
}
