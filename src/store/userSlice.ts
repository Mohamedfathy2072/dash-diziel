import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { doctypes } from "../doctypes";
import useAxios from "../hooks/useAxios";
import type { UserValuesTypes } from "../types/store";

export const getUser = createAsyncThunk(
  "user/getUser",
  async (name: string) => {
    const { server } = useAxios();
    // TODO: Fix doctypes import or replace with proper API endpoint
    const res = await server.get(
      `/users/${name}`,
      {
        params: {
          link_titles: true
        }
      }
    );
    const data = res?.data?.data
    const link_title = res?.data?._link_titles
    return { ...data, role_name: link_title?.[`TB superAdmin User Role::${data.role}`] };
  }
);

const initialState: UserValuesTypes = {
  user: undefined,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
