export const ar = {
  hello: "مرحباً",
  toggleColorTheme: "تبديل السمة اللونية",
  language: "تبديل اللغة",

  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  login: "تسجيل الدخول",
  joined_at: "تاريخ الإنضمام",

  // User-specific fields
  first_name: "الاسم الأول",
  last_name: "اسم العائلة",

  avatar: "الصورة ",
  select_role: "اختر الدور",
  no_role_assigned: "لم يتم تعيين دور",
  user_details: "تفاصيل المستخدم",
  edit_user: "تعديل المستخدم",
  loading_user: "جاري تحميل بيانات المستخدم...",

  profile: "الملف الشخصي",
  settings: "الإعدادات",
  logout: "تسجيل الخروج",

  name_ar: "الإسم (عربي)",
  name_en: "الإسم (إنجليزي)",
  name: "الإسم",
  slug: "الرابط المختصر",
  category: {
    title: "الفئة",
    plural: "الفئات",
    add: "إضافة فئة",
    add_sub_title: "يمكنك إضافة فئة جديدة",
    manage: "إدارة الفئة",
    manage_sub_title: "يمكنك إدارة الفئات، تعديلها أو حذفها",
    edit: "تعديل فئة",
    parent_category: "الفئة الرئيسية",
  },
  order: "الترتيب",
  image: "الصورة",
  submit: "إرسال",
  save: "حفظ",
  must_be_arabic: "يجب أن يكون بالعربية",
  must_be_english: "يجب أن يكون بالإنجليزية",

  dashboard: "لوحة التحكم",
  accounts: "الحسابات",
  add: "إضافة {name}",
  admin: {
    singular: "مدير",
    plural: "المدراء",
    description: "يمكنك إدارة المدراء، تعديلهم أو حذفهم",
  },
  user: {
    singular: "مستخدم",
    plural: "المستخدمين",
    description: "يمكنك إدارة المستخدمين، تعديلهم أو حذفهم",
  },
  permission: {
    singular: "صلاحية",
    plural: "الصلاحيات",
    description: "يمكنك إدارة الصلاحيات، تعديلها أو حذفها",
  },
  role: {
    singular: "دور",
    plural: "الأدوار",
    description: "يمكنك إدارة الأدوار، تعديلها أو حذفها",
    edit: "تعديل دور",
    edit_subtitle: "يمكنك عرض وتعديل وإزالة الدور",
    permissions: "الصلاحيات",
    select_all: "تحديد الكل",
    select_all_description: "تمكين جميع الصلاحيات المتاحة حاليًا",
    guard_name_description: "معرف النظام لهذا الدور",
    created_success: "تم إنشاء الدور بنجاح",
    created_error: "فشل إنشاء الدور",
    updated_success: "تم تحديث الدور بنجاح",
    updated_error: "فشل تحديث الدور",
    add: "إضافة دور",
    add_subtitle: "يمكنك إنشاء دور جديد وتعيين الصلاحيات",
    add_success: "تم إنشاء الدور بنجاح",
    add_error: "فشل إنشاء الدور",
  },

  search: "بحث",
  sort_by: "ترتيب حسب",
  sort_direction: "اتجاه الترتيب",
  active: "نشط",
  inactive: "غير نشط",
  id: "المعرف",
  actions: "إجراءات",
  view: "عرض",
  edit: "تعديل",
  delete: "حذف",
  delete_confirmation: "هل أنت متأكد أنك تريد الحذف؟",
  delete_success: "تم الحذف بنجاح",
  delete_failed: "فشل الحذف",
  add_success: "تمت الإضافة بنجاح",
  add_failed: "فشلت الإضافة",
  edit_success: "تم التعديل بنجاح",
  edit_failed: "فشل التعديل",
  loading: "جاري التحميل...",
  no_data: "لا توجد بيانات",
  no_results: "لا توجد نتائج",
  no_search_results: "لا توجد نتائج للبحث",
  no_permission: "لا توجد صلاحيات",
  no_role: "لا يوجد دور",
  no_category: "لا توجد فئات",
  no_admin: "لا يوجد مدراء",
  status: "الحالة",

  search_by_name_or_email: "البحث بالإسم أو البريد الإلكتروني",
  filter_by_role: "تصفية حسب الدور",

  reset_filters: "إعادة تعيين الفلاتر",
  profile_image: "صورة الملف الشخصي",
  account_info: "معلومات الحساب",
  email_verified: "البريد الإلكتروني مُوثّق",
  account_active: "الحساب نشط",
  leave_blank_to_keep_current: "اتركه فارغًا للحفاظ على كلمة المرور الحالية",
  no_roles_assigned: "لم يتم تعيين أي أدوار",

  // New translations for form validation and errors
  validation: {
    required: "هذا الحقل مطلوب",
    name_min_length: "يجب أن يكون الاسم أكثر من حرفين على الأقل",
    fname_min_length: "يجب أن يكون الاسم الأول أكثر من حرفين على الأقل",
    lname_min_length: "يجب أن يكون اسم العائلة أكثر من حرفين على الأقل",
    email_invalid: "عنوان البريد الإلكتروني غير صالح",
    role_required: "يجب اختيار دور واحد على الأقل",
    password_min_length: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
  },
  errors: {
    failed_to_load_data: "فشل تحميل البيانات",
    data_load_error: "تعذر استرجاع المعلومات",
    admin_load_error: "تعذر استرجاع معلومات هذا المدير",
    user_load_error: "تعذر استرجاع معلومات هذا المستخدم",
    create_failed: "فشل الإنشاء",
    update_failed: "فشل التحديث",
    admin_update_failed: "فشل تحديث المدير",
    user_update_failed: "فشل تحديث المستخدم",
    failed_to_load_admin_data: "فشل تحميل بيانات المدير",
    failed_to_load_user_data: "فشل تحميل بيانات المستخدم",
  },
  success: {
    create_success: "تم الإنشاء بنجاح",
    update_success: "تم التحديث بنجاح",
    admin_update_success: "تم تحديث المدير بنجاح",
    user_update_success: "تم تحديث المستخدم بنجاح",
  },
  confirmations: {
    unsaved_changes: "لديك تغييرات غير محفوظة. هل أنت متأكد أنك تريد المغادرة؟",
    confirm_navigation: "تأكيد التنقل",
    remove_admin: "هل أنت متأكد أنك تريد إزالة هذا المدير؟",
    confirm_remove_admin: "تأكيد إزالة المدير",
    remove_user: "هل أنت متأكد أنك تريد إزالة هذا المستخدم؟",
    confirm_remove_user: "تأكيد إزالة المستخدم",
    accept: "قبول",
    reject: "رفض",
    yes: "نعم",
    no: "لا",
  },
  select_roles: "اختر الأدوار",
  save_changes: "حفظ التغييرات",
  cancel: "إلغاء",
  admin_details: "تفاصيل المدير",
  edit_admin: "تعديل المدير",
  joined: "تاريخ الانضمام",
  drag_drop_image: "اسحب وأفلت الصورة هنا أو انقر للتصفح",
  created_at: "تم الإنشاء في",
  try_again: "حاول مرة أخرى",
  loading_admin: "جاري تحميل بيانات المدير...",
  guard_name: "اسم الحارس",

  access_control: "إدارة الوصول",
};
