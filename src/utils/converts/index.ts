export const convertEntityToDto = (entity: object, dto: object) => {
    if (entity) {
        Object.keys(entity).map(field => {
            if (dto.hasOwnProperty(field)) dto[field] = entity[field];
        });

        return dto;
    }

    return null;
}