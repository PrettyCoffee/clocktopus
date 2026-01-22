import {
  Dispatch,
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  KeyboardEvent,
  useState,
} from "react"

import { Slot } from "components/utility/slot"
import { AsChildProp, ClassNameProp } from "types/base-props"
import { createContext } from "utils/create-context"

type TabRef = RefObject<HTMLButtonElement | null>
type TabId = string | number

interface TabPatternContextState {
  baseId: string
  orientation: "horizontal" | "vertical"
  activeTab: TabId | undefined
  onTabChange: Dispatch<TabId | undefined>
  tabList: Record<TabId, TabRef>

  addTab: (tab: TabId, tabRef: TabRef) => void
  removeTab: (tab: TabId) => void
}

const Context = createContext<TabPatternContextState>("TabPattern")

const useTabIds = (tab: TabId) => {
  const { baseId } = Context.useRequiredValue()
  return {
    panel: `${baseId}-${tab}-panel`,
    tab: `${baseId}-${tab}-tab`,
  }
}

interface TabRootProps {
  orientation?: "horizontal" | "vertical"
  initialTab?: TabId
}
const Root = ({
  initialTab,
  orientation = "horizontal",
  children,
}: PropsWithChildren<TabRootProps>) => {
  const baseId = useId()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [tabList, setTabList] = useState<TabPatternContextState["tabList"]>({})

  const addTab = useCallback(
    (tab: TabId, tabRef: TabRef) =>
      setTabList(tabList => ({ ...tabList, [tab]: tabRef })),
    []
  )

  const removeTab = useCallback(
    (tab: TabId) =>
      // eslint-disable-next-line unused-imports/no-unused-vars -- explicitly used to remove this
      setTabList(({ [tab]: _removed, ...tabList }) => tabList),
    []
  )

  const provided = useMemo<TabPatternContextState>(
    () => ({
      baseId,
      orientation,
      activeTab,
      tabList,
      onTabChange: setActiveTab,
      addTab,
      removeTab,
    }),
    [baseId, orientation, activeTab, tabList, addTab, removeTab]
  )

  return <Context value={provided}>{children}</Context>
}

interface TabListProps extends AsChildProp, ClassNameProp {
  label: string
}
const TabList = ({
  label,
  asChild,
  children,
  ...delegated
}: PropsWithChildren<TabListProps>) => {
  const { orientation } = Context.useRequiredValue()
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      {...delegated}
    >
      {children}
    </Comp>
  )
}

const getTabElements = (tabList: TabPatternContextState["tabList"]) => {
  const tabRefs = Object.entries(tabList)
    .map(([id, ref]) => ({ id, element: ref.current }))
    .filter(Boolean)

  return tabRefs.toSorted((a, b) => {
    const rectA = a.element!.getBoundingClientRect()
    const rectB = b.element!.getBoundingClientRect()

    const valueA = rectA.top + rectA.left
    const valueB = rectB.top + rectB.left

    return valueA - valueB
  })
}

const getNavigableTabs = (
  tab: TabRef,
  tabList: TabPatternContextState["tabList"]
) => {
  const allTabs = getTabElements(tabList)
  const index = allTabs.findIndex(({ element }) => element === tab.current)
  return {
    first: allTabs[0],
    prev: allTabs[index - 1],
    next: allTabs[index + 1],
    last: allTabs.at(-1),
  }
}

interface TabProps extends AsChildProp, ClassNameProp {
  id: TabId
}

const Tab = ({
  asChild,
  children,
  id,
  ...delegated
}: PropsWithChildren<TabProps>) => {
  const { orientation, tabList, activeTab, onTabChange, addTab, removeTab } =
    Context.useRequiredValue()

  const ids = useTabIds(id)
  const ref = useRef<HTMLButtonElement>(null)
  const Comp = asChild ? Slot : "button"

  useEffect(() => {
    addTab(id, ref)
    return () => removeTab(id)
  }, [id, addTab, removeTab])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const switchTab = (target: keyof ReturnType<typeof getNavigableTabs>) => {
        const { id, element } = getNavigableTabs(ref, tabList)[target] ?? {}
        if (!element || !id) return
        element.focus()
        onTabChange(id)
      }

      const handler = {
        Home: () => switchTab("first"),
        End: () => switchTab("last"),

        ArrowLeft:
          orientation === "vertical" ? undefined : () => switchTab("prev"),
        ArrowRight:
          orientation === "vertical" ? undefined : () => switchTab("next"),

        ArrowUp:
          orientation === "horizontal" ? undefined : () => switchTab("prev"),
        ArrowDown:
          orientation === "horizontal" ? undefined : () => switchTab("next"),
      }[event.key]

      if (handler) {
        handler()
        event.preventDefault()
      }
    },
    [onTabChange, orientation, tabList]
  )

  return (
    <Comp
      ref={ref}
      role="tab"
      id={ids.tab}
      aria-controls={ids.panel}
      aria-selected={activeTab === id}
      onClick={() => onTabChange(id)}
      onKeyDown={handleKeyDown}
      {...delegated}
    >
      {children}
    </Comp>
  )
}

interface PanelProps extends AsChildProp, ClassNameProp {
  id: TabId
}
const Panel = ({
  asChild,
  id,
  children,
  ...delegated
}: PropsWithChildren<PanelProps>) => {
  const ids = useTabIds(id)
  const { activeTab } = Context.useRequiredValue()
  const Comp = asChild ? Slot : "div"

  if (activeTab !== id) return null

  return (
    <Comp
      role="tabpanel"
      id={ids.panel}
      aria-labelledby={ids.tab}
      {...delegated}
    >
      {children}
    </Comp>
  )
}

export const TabPattern = {
  Root,
  TabList,
  Tab,
  Panel,
  use: Context.useRequiredValue,
}
