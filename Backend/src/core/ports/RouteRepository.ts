import type {Route} from "../domain/Route";

export interface RouteRepository {
    findAll(): Promise<Route[]>;
    findById(id: number): Promise<Route | null>;
    findBaseline(): Promise<Route | null>;
    findOthers?(excludeId: number): Promise<Route[]>;
    setBaselineById(id: number): Promise<void>;
}