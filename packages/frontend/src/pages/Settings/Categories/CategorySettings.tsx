import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'
import type { Props as DndProps } from '@dnd-kit/core/dist/components/DndContext/DndContext'
import { DragIndicator } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Collapse from '@mui/material/Collapse'
import { chunk, groupBy } from 'lodash-es'
import React from 'react'

import { DropableComponent } from '@/components/DragAndDrop'
import { CategoryDrawer, CategoryGroupDrawer } from '@/components/drawers'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import { Emoji } from '@/components/Emoji'
import {
  useDeleteAccount,
  useDeleteCategoryGroup,
  useListAllAccountsWithRelations,
  useListCategoryGroups,
  useListTransactions,
  useSaveAccount,
  useSaveCategoryGroup,
  useSelectAllCategories,
} from '@/hooks'
import type { AppCommandIds, AppCommandRequest, IAccount, ICategoryGroup } from '@angelfish/core'
import { StyledCategoryGroupDivider, StyledCategoryGroupName } from './CategorySettings.styles'
import { CategoriesTable } from './components/CategoriesTable'
import { CategoryDeleteModal } from './components/CategoryDeleteModal'
import { BUBBLE_SIZE, CategoryGroupBubble } from './components/CategoryGroupBubble'
import { GroupDeleteModal } from './components/GroupDeleteModal'

const BUBBLEWIDTH = BUBBLE_SIZE + 16 + 8

/**
 * Category Settings Page
 */

export default function CategorySettings() {
  // Component State
  const container = React.useRef<HTMLDivElement | null>(null)
  const [showDrawer, setShowDrawer] = React.useState<boolean>(false)
  const [drawerType, setDrawerType] = React.useState<string>('')
  const [selectedGroup, setSelectedGroup] = React.useState<
    | {
        group: ICategoryGroup
        row?: number
        col?: number
        index?: number
        type?: 'income' | 'expenses'
      }
    | undefined
  >(undefined)
  const [showTable, setShowTable] = React.useState(false)
  const [itemsPerRow, setItemsPerRow] = React.useState<number>(0)
  const [selectedCategory, setSelectedCategory] = React.useState<IAccount>()
  const [dragItem, setDragItem] = React.useState<
    ({ canDo?: boolean; type?: 'income' | 'expenses' } & IAccount) | undefined
  >(undefined)
  const [deleting, setDeleting] = React.useState<
    { type: 'group'; data: ICategoryGroup } | { type: 'account'; data: IAccount } | undefined
  >(undefined)

  // Get Category Groups from Redux store and filter into Income/Expenses
  const { categoryGroups } = useListCategoryGroups()
  const { Income: categoryGroupsIncome, Expense: categoryGroupsExpense } = groupBy(
    categoryGroups,
    (group) => group.type,
  )

  // Get Categories from Redux store and filter for currect group
  const { categories } = useSelectAllCategories()
  const { accounts: accountsWithRelations } = useListAllAccountsWithRelations()
  const groupedCategories = groupBy(categories, (category) => category.cat_group_id)

  // Get transactions in background when selected category is changed
  const transactionQuery: AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS> | undefined =
    selectedCategory ? { cat_id: selectedCategory.id } : undefined

  const { transactions } = useListTransactions(transactionQuery ?? {})
  const CategoryGroupSaveMutation = useSaveCategoryGroup()
  const CategoryGroupDeleteMutation = useDeleteCategoryGroup()
  const accountSaveMutation = useSaveAccount()
  const accountDeleteMutation = useDeleteAccount()

  const updateItemsPerRow = React.useCallback(() => {
    if (!container.current) return

    const itemsPerRow = Math.floor(container.current?.clientWidth / BUBBLEWIDTH)
    setItemsPerRow(itemsPerRow)

    if (!selectedGroup) return

    const { index, group, type } = selectedGroup
    if (!index) return

    const row = Math.floor(index / itemsPerRow)
    const col = index % itemsPerRow

    setSelectedGroup({ group, type, index, row, col })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container.current, selectedGroup?.index])

  React.useEffect(() => {
    updateItemsPerRow()
    window.addEventListener('resize', updateItemsPerRow)
    return () => window.removeEventListener('resize', updateItemsPerRow)
  }, [updateItemsPerRow])

  /**
   * Handle selecting a Category Group bubble
   */
  const onGroupSelect = (
    categoryGroup: ICategoryGroup,
    index: number,
    type: 'income' | 'expenses',
  ) => {
    if (categoryGroup.id === selectedGroup?.group.id) {
      setShowTable(false)
    } else {
      setShowTable(true)
      const row = Math.floor(index / itemsPerRow)
      const col = index % itemsPerRow
      setSelectedGroup({ group: categoryGroup, row, col, index, type })
    }
  }

  /**
   * Handle Clicking 'Edit Group' link for Category Group
   */
  const onGroupEdit = (categoryGroup: ICategoryGroup) => {
    setShowDrawer(true)
    setDrawerType('editCategoryGroup')
    setSelectedGroup({ group: categoryGroup })
  }

  /**
   * Handle selecting a Category on the Category Table
   */
  const onCategorySelect = (category: IAccount) => {
    setShowDrawer(true)
    setDrawerType('editCategory')
    setSelectedCategory(category)
  }

  /**
   * Called whenever a drawer is closed
   */
  const onDrawerClose = () => {
    setShowDrawer(false)
    setDrawerType('')
  }

  /**
   * Handle Saving a Category Group
   */
  const onGroupSave = (categoryGroup: ICategoryGroup) => {
    CategoryGroupSaveMutation.mutate(categoryGroup)
  }

  /**
   * Handle Deleting a Category Group
   */
  const onGroupDelete = async (reassignId?: number) => {
    await CategoryGroupDeleteMutation.mutate({ id: deleting?.data.id as number, reassignId })

    const newCategoryGroupID = categories.at(0)?.cat_group_id
    const type = deleting?.type.toLowerCase() as 'income' | 'expenses'
    const index = (type === 'income' ? categoryGroupsIncome : categoryGroupsExpense).findIndex(
      (x) => x.id === newCategoryGroupID,
    )
    onGroupSelect(
      (type === 'income' ? categoryGroupsIncome : categoryGroupsExpense)[index],
      index,
      type,
    )
  }

  /**
   * Handle Saving a Category
   */
  const onCategorySave = (category: IAccount) => {
    accountSaveMutation.mutate(category)
  }

  /**
   * Handle Deleting a Category
   */
  const onCategoryDelete = (id: IAccount['id'], reassignId?: IAccount['id']) => {
    accountDeleteMutation.mutate({ id, reassignId: reassignId ?? null })
    setDeleting(undefined)
  }

  /**
   * Return the drawer contents to add/edit Categories/Category Groups
   */
  const renderDrawer = () => {
    switch (drawerType) {
      case 'addCategory':
        return (
          <CategoryDrawer
            initialValue={selectedCategory}
            initialGroupType={selectedGroup?.group?.type}
            categoryGroups={categoryGroups}
            onClose={onDrawerClose}
            onSave={onCategorySave}
            onDelete={(value: IAccount) => setDeleting({ type: 'account', data: value })}
            open={showDrawer}
          />
        )
      case 'editCategory':
        return (
          <CategoryDrawer
            categoryGroups={categoryGroups}
            onClose={onDrawerClose}
            onSave={onCategorySave}
            onDelete={(value: IAccount) => setDeleting({ type: 'account', data: value })}
            initialValue={selectedCategory}
            initialGroupType={selectedGroup?.group?.type}
            open={showDrawer}
          />
        )
      case 'editCategoryGroup':
        return (
          <CategoryGroupDrawer
            onClose={onDrawerClose}
            onSave={onGroupSave}
            onDelete={(value) => setDeleting({ type: 'group', data: value })}
            categoryGroup={selectedGroup?.group}
            open={showDrawer}
          />
        )
      case 'addCategoryGroup':
        return (
          <CategoryGroupDrawer
            onClose={onDrawerClose}
            onSave={onGroupSave}
            onDelete={(value) => setDeleting({ type: 'group', data: value })}
            open={showDrawer}
          />
        )
      default:
        // Return empty
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>
    }
  }

  const handleDragStart: DndProps['onDragStart'] = (event) => {
    const active = event.active.data.current as IAccount
    setDragItem({ ...active, canDo: false })
  }

  const handleDragOver: DndProps['onDragOver'] = (event) => {
    const over = event?.over?.data?.current as ICategoryGroup | undefined

    if (!dragItem) return

    setDragItem({
      ...dragItem,
      canDo: over?.type.toLowerCase() === dragItem.type,
    })
  }

  const handleDragEnd: DndProps['onDragEnd'] = (event) => {
    const over = event?.over?.data?.current as ICategoryGroup | undefined

    // if the item is not dropped over dropable Component
    // if its dropped over the same categoryGroup
    // if can do is not true
    if (!over || dragItem?.cat_group_id === over?.id || !dragItem?.canDo) return

    const [_, row, col, type] = String(event.over?.id).split('-')
    setDragItem(undefined)
    onGroupSelect(over, +row * itemsPerRow + +col, type as 'income' | 'expenses')
    onCategorySave({ ...dragItem, cat_group_id: over.id })
  }

  // Render
  return (
    <Box ref={container} display="flex" flexDirection="column" flexGrow={1}>
      {/*
       * Top Toolbar
       */}
      <Box display="flex" alignItems="center" justifyContent="end" marginBottom={2}>
        <DropdownMenuButton
          variant="outlined"
          label="Add a Group / Category"
          menuItems={[
            {
              label: 'Add a Group',
              onClick: () => {
                setSelectedGroup(undefined)
                setShowDrawer(true)
                setDrawerType('addCategoryGroup')
              },
            },
            {
              label: 'Add a Category',
              onClick: () => {
                setSelectedGroup(undefined)
                setSelectedCategory(undefined)
                setShowDrawer(true)
                setDrawerType('addCategory')
              },
            },
          ]}
        />
      </Box>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <DragOverlay>
          {!!dragItem && (
            <Card
              sx={{
                opacity: dragItem.canDo ? 1 : 0.75,
                whiteSpace: 'nowrap',
                width: '350px',
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button sx={{ padding: '1rem', height: 'unset' }} color="primary" variant="text">
                  <DragIndicator />
                </Button>
                <Box mx={2}>
                  {dragItem.cat_icon && <Emoji size={24} emoji={dragItem.cat_icon} />}
                </Box>
                {dragItem.name}
              </Box>
            </Card>
          )}
        </DragOverlay>
        {/*
         * Income Category Groups
         */}
        {!!categoryGroupsIncome?.length && (
          <Box>
            <Box display="flex" alignItems="center" my={2}>
              <StyledCategoryGroupName>Income</StyledCategoryGroupName>
              <StyledCategoryGroupDivider></StyledCategoryGroupDivider>
            </Box>

            <Box display="flex" flexWrap="wrap" alignItems="center">
              {chunk(categoryGroupsIncome, itemsPerRow).map((categoryGroups, row) => (
                <React.Fragment key={`category-${row}`}>
                  {categoryGroups.map((categoryGroup, col) => (
                    <React.Fragment key={`category-${row}-${col}`}>
                      <DropableComponent id={`dropable-${row}-${col}-income`} data={categoryGroup}>
                        {({ setNodeRef }) => (
                          <Box
                            ref={setNodeRef}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flex="none"
                            width={`${100 / itemsPerRow}%`}
                          >
                            <CategoryGroupBubble
                              categoryGroup={{
                                ...categoryGroup,
                                total_categories: groupedCategories[categoryGroup.id]?.length,
                              }}
                              isSelected={categoryGroup.id === selectedGroup?.group.id}
                              onEdit={() => onGroupEdit(categoryGroup)}
                              onClick={() =>
                                onGroupSelect(categoryGroup, row * itemsPerRow + col, 'income')
                              }
                            />
                          </Box>
                        )}
                      </DropableComponent>

                      {row === selectedGroup?.row &&
                        col === categoryGroups.length - 1 &&
                        selectedGroup.type === 'income' && (
                          <Collapse
                            appear
                            in={showTable}
                            sx={{ width: '100%' }}
                            onExited={() => setSelectedGroup(undefined)}
                            timeout={500}
                          >
                            <Box width="100%" position="relative">
                              <CategoriesTable
                                EmptyView={
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <div>No category created for this group yet</div>
                                    <Button
                                      sx={{ marginTop: '1rem' }}
                                      onClick={() => {
                                        setSelectedCategory({
                                          class: 'CATEGORY',
                                          cat_group_id: selectedGroup.group.id,
                                          cat_icon: selectedGroup.group.icon,
                                        } as IAccount)
                                        setDrawerType('addCategory')
                                        setShowDrawer(true)
                                      }}
                                    >
                                      Add a Category
                                    </Button>
                                  </Box>
                                }
                                categories={(groupedCategories[selectedGroup?.group.id] ?? []).map(
                                  (data) => ({ ...data, type: 'income' }),
                                )}
                                onSelect={onCategorySelect}
                                pointerPosition={`${
                                  (100 / itemsPerRow) * (selectedGroup?.col ?? 0 + 1) +
                                  100 / itemsPerRow / 2
                                }%`}
                              />
                            </Box>
                          </Collapse>
                        )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        )}

        {/*
         * Expense Category Groups
         */}
        {!!categoryGroupsExpense?.length && (
          <Box>
            <Box display="flex" alignItems="center" my={2}>
              <StyledCategoryGroupName>Expenses</StyledCategoryGroupName>
              <StyledCategoryGroupDivider></StyledCategoryGroupDivider>
            </Box>

            <Box display="flex" flexWrap="wrap" alignItems="center">
              {chunk(categoryGroupsExpense, itemsPerRow).map((categoryGroups, row) => (
                <React.Fragment key={`category-${row}`}>
                  {categoryGroups.map((categoryGroup, col) => (
                    <React.Fragment key={`category-${row}-${col}`}>
                      <DropableComponent
                        id={`dropable-${row}-${col}-expenses`}
                        data={categoryGroup}
                      >
                        {({ setNodeRef }) => (
                          <Box
                            ref={setNodeRef}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flex="none"
                            width={`${100 / itemsPerRow}%`}
                          >
                            <CategoryGroupBubble
                              categoryGroup={{
                                ...categoryGroup,
                                total_categories: groupedCategories[categoryGroup.id]?.length,
                              }}
                              isSelected={categoryGroup.id === selectedGroup?.group.id}
                              onEdit={() => onGroupEdit(categoryGroup)}
                              onClick={() =>
                                onGroupSelect(categoryGroup, row * itemsPerRow + col, 'expenses')
                              }
                            />
                          </Box>
                        )}
                      </DropableComponent>

                      {row === selectedGroup?.row &&
                        col === categoryGroups.length - 1 &&
                        selectedGroup.type === 'expenses' && (
                          <Collapse
                            appear
                            in={showTable}
                            sx={{ width: '100%' }}
                            onExited={() => setSelectedGroup(undefined)}
                            timeout={500}
                          >
                            <Box width="100%" position="relative">
                              <CategoriesTable
                                EmptyView={
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <div>No category created for this group yet</div>
                                    <Button
                                      sx={{ marginTop: '1rem' }}
                                      onClick={() => {
                                        setSelectedCategory({
                                          class: 'CATEGORY',
                                          cat_group_id: selectedGroup.group.id,
                                          cat_icon: selectedGroup.group.icon,
                                        } as IAccount)
                                        setDrawerType('addCategory')
                                        setShowDrawer(true)
                                      }}
                                    >
                                      Add a Category
                                    </Button>
                                  </Box>
                                }
                                categories={(groupedCategories[selectedGroup?.group.id] ?? []).map(
                                  (data) => ({ ...data, type: 'expense' }),
                                )}
                                onSelect={onCategorySelect}
                                pointerPosition={`${
                                  (100 / itemsPerRow) * (selectedGroup?.col ?? 0 + 1) +
                                  100 / itemsPerRow / 2
                                }%`}
                              />
                            </Box>
                          </Collapse>
                        )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        )}
      </DndContext>
      {showDrawer && renderDrawer()}
      {deleting?.type === 'account' && (
        <CategoryDeleteModal
          onClose={() => setDeleting(undefined)}
          account={deleting.data}
          onConfirm={onCategoryDelete}
          options={accountsWithRelations}
          transactions={transactions}
        />
      )}
      {deleting?.type === 'group' && (
        <GroupDeleteModal
          options={deleting.data.type === 'Income' ? categoryGroupsIncome : categoryGroupsExpense}
          categoryGroup={deleting.data}
          onClose={() => setDeleting(undefined)}
          onConfirm={(reassignId) => onGroupDelete(reassignId)}
          accounts={groupedCategories[deleting.data.id]}
        />
      )}
    </Box>
  )
}
