import { createSlice } from "@reduxjs/toolkit";
import { fetchCategory, fetchCategoryById, updateStatus } from "./CategoryThunk";

import { Category } from "../../types/Category";
import { CategoryList } from "../../types/CategoryList";


interface initialState {
  categoryLoading: boolean,
  categoryError: boolean | string,
  categoryData: Category[],
  currentCategoryLoading: boolean,
  currentCategory: CategoryList,
  currentCategoryError: boolean | string,
  currentId: string,
  categoryStatus: boolean,
  categoryStatusError: boolean | string
}
const CategorySlice = createSlice({

  name: "category",
  initialState: {} as initialState,
  reducers: {
    setCurrentId(state, action) {
      state.currentId = action.payload
    }
  },
  extraReducers(builder) {

    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {

      state.currentCategory = action.payload;
      state.currentCategoryLoading = false
      state.currentCategoryError = false;
    });
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.currentCategoryLoading = true;
      state.currentCategoryError = false;


    });
    builder.addCase(fetchCategoryById.rejected, (state, action) => {
      state.currentCategoryLoading = false;

      state.currentCategoryError = action.error.message
        ? action.error.message
        : "";

    });
    builder.addCase(fetchCategory.fulfilled, (state, action) => {

      const categoryData = action.payload.filter((item) => {
        return item.status == 'Pending'
      })
      state.categoryData = categoryData
      state.categoryLoading = false;
      state.categoryError = false;
    });
    builder.addCase(fetchCategory.pending, (state) => {
      state.categoryLoading = true;
      state.categoryError = false;
    });
    builder.addCase(fetchCategory.rejected, (state, action) => {

      state.categoryLoading = false;
      state.categoryError = action.error.message ? action.error.message : '';

    });
    builder.addCase(updateStatus.fulfilled, (state, action) => {
      const categoryData = state.categoryData.filter((item) => {
        return item._id != action.payload
      })
      if (categoryData.length != 0) {

        state.currentCategory = {};
        state.currentId = categoryData[0]._id;
        state.categoryStatus = false;
        state.categoryData = categoryData;
        state.categoryStatusError = false;
      }
      else {
        state.categoryData = []
        state.currentCategory = {}
      }


    });
    builder.addCase(updateStatus.pending, (state) => {
      state.categoryStatus = true
      state.categoryStatusError = false
    });

    builder.addCase(updateStatus.rejected, (state) => {
      state.categoryStatusError = true
    });




  }

})

export default CategorySlice

export const { setCurrentId } = CategorySlice.actions