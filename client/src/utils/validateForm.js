export const validateRegister = (data) => {
    const errors = {};

    // Họ
    if (!data.firstname?.trim()) {
        errors.firstname = "Họ không được để trống";
    } else if (data.firstname.length < 2) {
        errors.firstname = "Họ phải có ít nhất 2 ký tự";
    }

    // Tên
    if (!data.lastname?.trim()) {
        errors.lastname = "Tên không được để trống";
    } else if (data.lastname.length < 2) {
        errors.lastname = "Tên phải có ít nhất 2 ký tự";
    }

    // Email
    if (!data.email?.trim()) {
        errors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email không hợp lệ";
    }

    // Mật khẩu
    if (!data.password?.trim()) {
        errors.password = "Mật khẩu không được để trống";
    } else if (data.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Xác nhận mật khẩu
    if (!data.confirmPassword?.trim()) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (data.confirmPassword !== data.password) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateLogin = (data) => {
    const errors = {};

    // Email
    if (!data.email?.trim()) {
        errors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email không hợp lệ";
    }

    // Mật khẩu
    if (!data.password?.trim()) {
        errors.password = "Mật khẩu không được để trống";
    } else if (data.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateForgotPassword = (data) => {
    const errors = {};

    // Email
    if (!data.email?.trim()) {
        errors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email không hợp lệ";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateResetPassword = (data) => {
    const errors = {};

    // Mật khẩu
    if (!data.newPassword?.trim()) {
        errors.newPassword = "Mật khẩu không được để trống";
    } else if (data.newPassword.length < 6) {
        errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Xác nhận mật khẩu
    if (!data.confirmPassword?.trim()) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (data.confirmPassword !== data.newPassword) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};