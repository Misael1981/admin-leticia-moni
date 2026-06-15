import { ProductDTO } from "@/dtos/categories.dto"

type CategoryWithProducts = {
  id: string
  name: string
  description: string | null
  products: ProductDTO[]
}

export type AdminStoreState = {
  categories: CategoryWithProducts[]
  selectedCategoryId: string | null
  selectedProductId: string | null
  isCreateCategoryModalOpen: boolean
  isEditCategoryModalOpen: boolean
  isDeleteCategoryModalOpen: boolean
}

type AdminStoreAction =
  | { type: "SET_CATEGORIES"; payload: CategoryWithProducts[] }
  | { type: "SELECT_CATEGORY"; payload: string }
  | { type: "SELECT_PRODUCT"; payload: string }
  | { type: "REMOVE_CATEGORY"; payload: string }
  | { type: "REMOVE_PRODUCT"; payload: string }
  | { type: "RESET" }

export const initialAdminStoreState: AdminStoreState = {
  categories: [],
  selectedCategoryId: null,
  selectedProductId: null,
  isCreateCategoryModalOpen: false,
  isEditCategoryModalOpen: false,
  isDeleteCategoryModalOpen: false,
}

export function catalogReducer(
  state: AdminStoreState,
  action: AdminStoreAction,
): AdminStoreState {
  switch (action.type) {
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        selectedCategoryId: action.payload[0]?.id ?? null,
      }

    case "SELECT_CATEGORY":
      return {
        ...state,
        selectedCategoryId: action.payload,
      }

    case "RESET":
      return initialAdminStoreState

    case "REMOVE_CATEGORY": {
      const filtered = state.categories.filter((c) => c.id !== action.payload)

      return {
        ...state,
        categories: filtered,
        selectedCategoryId:
          state.selectedCategoryId === action.payload
            ? (filtered[0]?.id ?? null)
            : state.selectedCategoryId,
      }
    }

    default:
      return state
  }
}
