import { User } from "enonic-types/auth";
import { Content } from "enonic-types/content";
import { User as KostiUser } from "./user";

export interface UserAllData {
  content: Content<KostiUser>;
  user: User;
  data?: {
    roles: {
      gameMaster?: boolean;
      moderator?: boolean;
    };
  };
}
