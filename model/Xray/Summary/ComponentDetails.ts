export class ComponentDetails {
    public component_id: string = '';

    constructor(componentId: string) {
        this.component_id = componentId;
    }
    public toString(): string {
        return this.component_id;
    }
}
