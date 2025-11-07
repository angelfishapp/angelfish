import type { ReactNode } from 'react'

/**
 * DashboardChart Component Properties
 */
export interface DashboardChartProps {
  /**
   * Title of children Chart
   */
  title: string | ReactNode | ReactNode[]
  /**
   * Description for children Chart
   */
  description?: string | ReactNode | ReactNode[]
  /**
   * Chart component
   */
  children: ReactNode | ReactNode[]
}
