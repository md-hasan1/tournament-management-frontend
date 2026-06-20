import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TeamSelectionState = {
  selectedTeamId: string | null;
};

const initialState: TeamSelectionState = {
  selectedTeamId: null,
};

const teamSelectionSlice = createSlice({
  name: "teamSelection",
  initialState,
  reducers: {
    setSelectedTeamId(state, action: PayloadAction<string | null>) {
      state.selectedTeamId = action.payload;
    },
    clearSelectedTeamId(state) {
      state.selectedTeamId = null;
    },
  },
});

export const { setSelectedTeamId, clearSelectedTeamId } =
  teamSelectionSlice.actions;

export default teamSelectionSlice.reducer;
