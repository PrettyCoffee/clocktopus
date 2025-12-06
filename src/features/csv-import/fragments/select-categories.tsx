import { Dispatch, Fragment } from "react"

import { CategorySelect } from "features/components/category-select"

import { Container } from "./container"

export type CategoryMapping = Record<string, string>

interface SelectCategoryProps {
  importedCategories: string[]
  categoryMapping: CategoryMapping
  onCategoryMappingChange: Dispatch<CategoryMapping>
}
export const SelectCategory = ({
  importedCategories: importedCategory,
  categoryMapping,
  onCategoryMappingChange,
}: SelectCategoryProps) => (
  <Container title="Category mapping">
    <div className="grid max-h-58 grid-cols-[auto_1fr] items-center gap-2 overflow-auto">
      {importedCategory.length === 0 ? (
        <span className="text-text-gentle">No categories found</span>
      ) : (
        importedCategory.map(category => (
          <Fragment key={category}>
            <div className="truncate">{category}:</div>
            <CategorySelect
              value={categoryMapping[category] ?? ""}
              onChange={id => onCategoryMappingChange({ [category]: id })}
            />
          </Fragment>
        ))
      )}
    </div>
  </Container>
)
