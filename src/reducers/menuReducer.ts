export type AdminStoreState = {
  selectedCategoryId: string | null
  selectedGroupId: string | null
  selectedProductId: string | null
}

type AdminStoreAction =
  | { type: "SELECT_CATEGORY"; payload: string }
  | { type: "SELECT_GROUP"; payload: string | null }
  | { type: "SELECT_PRODUCT"; payload: string }

export const initialAdminStoreState: AdminStoreState = {
  selectedCategoryId: null,
  selectedGroupId: null,
  selectedProductId: null,
}

export function catalogReducer(
  state: AdminStoreState,
  action: AdminStoreAction,
): AdminStoreState {
  switch (action.type) {
    case "SELECT_CATEGORY":
      return {
        ...state,
        selectedCategoryId: action.payload,
        selectedGroupId: null,
        selectedProductId: null,
      }

    case "SELECT_GROUP":
      return {
        ...state,
        selectedGroupId: action.payload,
        selectedProductId: null,
      }

    case "SELECT_PRODUCT":
      return {
        ...state,
        selectedProductId: action.payload,
      }

    default:
      return state
  }
}
