import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const userInfoHook = () => useContext(UserInfoContext);

export default userInfoHook;