import type { IInstitutionUpdate } from '@angelfish/core'

/**
 * InstitutionDrawer Component Properties
 */

export interface InstitutionDrawerProps {
  /**
   * If provided, will open drawer in edit mode, otherwise
   * will open in create mode
   */
  initialValue?: IInstitutionUpdate
  /**
   * Show (true) or hide (false) the drawer
   * @default true
   */
  open?: boolean
  /**
   * Function triggered when closing drawer
   */
  onClose?: () => void
  /**
   * Function triggered when saving
   */
  onSave?: (institution: IInstitutionUpdate) => void
  /**
   * Callback triggered when removing Institution
   */
  onRemove?: (id: number) => void
  /**
   * Async Callback to power autocomplete search as user searches
   * remote Institutions from Cloud API
   */
  onSearch: (query: string) => Promise<IInstitutionUpdate[]>
}
