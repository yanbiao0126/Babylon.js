import type { Scene } from "./scene";
import type { Nullable } from "./types";
import type { AbstractMesh } from "./Meshes/abstractMesh";
import type { TransformNode } from "./Meshes/transformNode";
import type { Geometry } from "./Meshes/geometry";
import type { Skeleton } from "./Bones/skeleton";
import type { MorphTargetManager } from "./Morph/morphTargetManager";
import type { AssetContainer } from "./assetContainer";
import type { IParticleSystem } from "./Particles/IParticleSystem";
import type { AnimationGroup } from "./Animations/animationGroup";
import type { BaseTexture } from "./Materials/Textures/baseTexture";
import type { Material } from "./Materials/material";
import type { MultiMaterial } from "./Materials/multiMaterial";
import type { AbstractActionManager } from "./Actions/abstractActionManager";
import type { Camera } from "./Cameras/camera";
import type { Light } from "./Lights/light";
import type { Node } from "./node";
import type { PostProcess } from "./PostProcesses/postProcess";
import type { Animation } from "./Animations/animation";

/**
 * Defines how the parser contract is defined.
 * These parsers are used to parse a list of specific assets (like particle systems, etc..)
 */
export type BabylonFileParser = (parsedData: any, scene: Scene, container: AssetContainer, rootUrl: string) => void;

/**
 * Defines how the individual parser contract is defined.
 * These parser can parse an individual asset
 */
export type IndividualBabylonFileParser = (parsedData: any, scene: Scene, rootUrl: string) => any;

/**
 * Base class of the scene acting as a container for the different elements composing a scene.
 * This class is dynamically extended by the different components of the scene increasing
 * flexibility and reducing coupling
 */
export abstract class AbstractScene {
    /**
     * Stores the list of available parsers in the application.
     */
    private static _BabylonFileParsers: { [key: string]: BabylonFileParser } = {};

    /**
     * Stores the list of available individual parsers in the application.
     */
    private static _IndividualBabylonFileParsers: { [key: string]: IndividualBabylonFileParser } = {};

    /**
     * Adds a parser in the list of available ones
     * @param name Defines the name of the parser
     * @param parser Defines the parser to add
     */
    public static AddParser(name: string, parser: BabylonFileParser): void {
        this._BabylonFileParsers[name] = parser;
    }

    /**
     * Gets a general parser from the list of available ones
     * @param name Defines the name of the parser
     * @returns the requested parser or null
     */
    public static GetParser(name: string): Nullable<BabylonFileParser> {
        if (this._BabylonFileParsers[name]) {
            return this._BabylonFileParsers[name];
        }

        return null;
    }

    /**
     * Adds n individual parser in the list of available ones
     * @param name Defines the name of the parser
     * @param parser Defines the parser to add
     */
    public static AddIndividualParser(name: string, parser: IndividualBabylonFileParser): void {
        this._IndividualBabylonFileParsers[name] = parser;
    }

    /**
     * Gets an individual parser from the list of available ones
     * @param name Defines the name of the parser
     * @returns the requested parser or null
     */
    public static GetIndividualParser(name: string): Nullable<IndividualBabylonFileParser> {
        if (this._IndividualBabylonFileParsers[name]) {
            return this._IndividualBabylonFileParsers[name];
        }

        return null;
    }

    /**
     * Parser json data and populate both a scene and its associated container object
     * @param jsonData Defines the data to parse
     * @param scene Defines the scene to parse the data for
     * @param container Defines the container attached to the parsing sequence
     * @param rootUrl Defines the root url of the data
     */
    public static Parse(jsonData: any, scene: Scene, container: AssetContainer, rootUrl: string): void {
        for (const parserName in this._BabylonFileParsers) {
            if (Object.prototype.hasOwnProperty.call(this._BabylonFileParsers, parserName)) {
                this._BabylonFileParsers[parserName](jsonData, scene, container, rootUrl);
            }
        }
    }

    /**
     * Gets the list of root nodes (ie. nodes with no parent)
     */
    public rootNodes = new Array<Node>();

    /** All of the cameras added to this scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
     */
    public cameras = new Array<Camera>();

    /**
     * All of the lights added to this scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
     */
    public lights = new Array<Light>();

    /**
     * All of the (abstract) meshes added to this scene
     */
    public meshes = new Array<AbstractMesh>();

    /**
     * The list of skeletons added to the scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/bonesSkeletons
     */
    public skeletons = new Array<Skeleton>();

    /**
     * All of the particle systems added to this scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/particle_system_intro
     */
    public particleSystems = new Array<IParticleSystem>();

    /**
     * Gets a list of Animations associated with the scene
     */
    public animations: Animation[] = [];

    /**
     * All of the animation groups added to this scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/groupAnimations
     */
    public animationGroups = new Array<AnimationGroup>();

    /**
     * All of the multi-materials added to this scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/multiMaterials
     */
    public multiMaterials = new Array<MultiMaterial>();

    /**
     * All of the materials added to this scene
     * In the context of a Scene, it is not supposed to be modified manually.
     * Any addition or removal should be done using the addMaterial and removeMaterial Scene methods.
     * Note also that the order of the Material within the array is not significant and might change.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction
     */
    public materials = new Array<Material>();

    /**
     * The list of morph target managers added to the scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/dynamicMeshMorph
     */
    public morphTargetManagers = new Array<MorphTargetManager>();

    /**
     * The list of geometries used in the scene.
     */
    public geometries = new Array<Geometry>();

    /**
     * All of the transform nodes added to this scene
     * In the context of a Scene, it is not supposed to be modified manually.
     * Any addition or removal should be done using the addTransformNode and removeTransformNode Scene methods.
     * Note also that the order of the TransformNode within the array is not significant and might change.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/parent_pivot/transform_node
     */
    public transformNodes = new Array<TransformNode>();

    /**
     * ActionManagers available on the scene.
     * @deprecated
     */
    public actionManagers = new Array<AbstractActionManager>();

    /**
     * Textures to keep.
     */
    public textures = new Array<BaseTexture>();

    /** @internal */
    protected _environmentTexture: Nullable<BaseTexture> = null;
    /**
     * Texture used in all pbr material as the reflection texture.
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to reference from here than from all the materials.
     */
    public get environmentTexture(): Nullable<BaseTexture> {
        return this._environmentTexture;
    }

    public set environmentTexture(value: Nullable<BaseTexture>) {
        this._environmentTexture = value;
    }

    /**
     * The list of postprocesses added to the scene
     */
    public postProcesses = new Array<PostProcess>();

    /**
     * @returns all meshes, lights, cameras, transformNodes and bones
     */
    public getNodes(): Array<Node> {
        let nodes = new Array<Node>();
        nodes = nodes.concat(this.meshes);
        nodes = nodes.concat(this.lights);
        nodes = nodes.concat(this.cameras);
        nodes = nodes.concat(this.transformNodes); // dummies
        this.skeletons.forEach((skeleton) => (nodes = nodes.concat(skeleton.bones)));
        return nodes;
    }
}
