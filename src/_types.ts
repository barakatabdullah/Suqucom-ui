export {};

declare global {
  type QueryParams = {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
    role?: string;
    active?: boolean | null;
  };

  type Permission = {
    id: number;
    name: string;
    key: string;
    guard_name: string;
  };

  type Role = {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
  };

  type Admin = {
    id: number;
    name: string;
    email: string;
    is_email_verified: boolean;
    locale: string;
    active: boolean;
    avatar: string;
    roles: Role[];
    created_at: string;
  };

  type User = {
    id: number;
    name: string;
    fname: string;
    lname: string;
    email: string;
    locale: string;
    avatar: string;
    created_at: string;
  };

  type Category = {
    id: number;
    name: string;
    name_ar?: string;
    name_en?: string;
    slug: string;
    image?: string;
    active: boolean;
    order?: number | null;
    published: boolean;
    parent_id?: number;
    parent_category?: Category;
  };
}
