/**
 * Hook tổng quát cho các model có xóa mềm (paranoid: true)
 * - Khi xóa mềm 1 bản ghi, có thể xử lý logic liên quan
 * - Ví dụ: cập nhật trạng thái, xóa mềm các bản ghi con, log ra console,...
 */

export const addSoftDeleteHook = (model, relatedModels = []) => {
    model.addHook('beforeDestroy', async (instance, options) => {
        console.log(`🔹 Soft deleting ${model.name} with ID: ${instance.id}`);

        // Nếu model có field 'isActive' => set về false thay vì xóa
        if (instance.isActive !== undefined) {
            instance.isActive = false;
            await instance.save({ hooks: false });
        }

        // Nếu có bảng liên kết => xóa mềm luôn các bản ghi con
        if (relatedModels.length > 0) {
            for (const { model: RelatedModel, foreignKey } of relatedModels) {
                await RelatedModel.update(
                    { deletedAt: new Date() },
                    {
                        where: { [foreignKey]: instance.id },
                        individualHooks: true,
                    }
                );
                console.log(`Soft deleted related ${RelatedModel.name} records`);
            }
        }
    });
};
