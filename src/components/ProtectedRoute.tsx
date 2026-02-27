// // import { Navigate, Outlet } from "react-redux"; // Wait, it's react-router-dom ... let me just import it properly.

// // // Actually I'll use write_to_file for ProtectedRoute.tsx
// // import { Navigate, Outlet } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import { RootState } from "../store/store";

// // export const ProtectedRoute = () => {
// //   const isAuthenticated = useSelector(
// //     (state: RootState) => state.auth.isAuthenticated,
// //   );

// //   if (!isAuthenticated) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return <Outlet />;
// // };

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../store/store";
// import { RootState } from "../store/store";
import type { RootState } from "../store/store";
// export const ProtectedRoute = () => {
//   const isAuthenticated = useSelector(
//     (state: RootState) => state.auth.isAuthenticated,
//   );

//   if (!isAuthenticated) {
//     // replace: true ensures the user can't go "back" to the protected page
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

export const ProtectedRoute = () => {
  const auth = useSelector((state: RootState) => state.auth);
  console.log("Current Auth State:", auth); // This will show in your browser console

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
