export const objectToFormData = (object) => {
    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        // Nếu là mảng file -> append từng file
        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(key, item);
            });
        } else {
            formData.append(key, value);
        }
    });

    return formData;
};
