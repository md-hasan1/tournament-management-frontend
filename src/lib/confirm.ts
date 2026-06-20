import Swal, { SweetAlertIcon } from "sweetalert2";

const BRAND_CONFIRM_COLOR = "#35BACB";
const BRAND_CANCEL_COLOR = "#374151"; // gray-700
const BRAND_BG = "#0A0A0A";
const BRAND_TEXT = "#FFFFFF";

export async function confirmDelete(options?: {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> {
  const {
    title = "Delete Item?",
    text = "Are you sure you want to delete this? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
  } = options || {};

  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: BRAND_CONFIRM_COLOR,
    cancelButtonColor: BRAND_CANCEL_COLOR,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    background: BRAND_BG,
    color: BRAND_TEXT,
  });

  return Boolean(result.isConfirmed);
}

export async function alertSuccess(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: BRAND_CONFIRM_COLOR,
    background: BRAND_BG,
    color: BRAND_TEXT,
  });
}

export async function alertError(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: BRAND_CONFIRM_COLOR,
    background: BRAND_BG,
    color: BRAND_TEXT,
  });
}

export async function alertInfo(
  title: string,
  text?: string,
  icon: SweetAlertIcon = "info",
) {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: BRAND_CONFIRM_COLOR,
    background: BRAND_BG,
    color: BRAND_TEXT,
  });
}
