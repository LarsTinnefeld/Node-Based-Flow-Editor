import { Accessor, Component, For } from "solid-js";
import styles from "/styles.module.css";

interface NodeProps {
  id: string;
  x: number;
  y: number;
  numberInputs: number;
  numberOutputs: number;
  selected: boolean;
  onMouseDownNode: (id: string, event: any) => void;
  onMouseDownOutput: (
    outputPositionX: number,
    outputPositionY: number,
    nodeId: string,
    outputIndex: number
  ) => void;
  onMouseEnterInput: (
    inputPositionX: number,
    inputPositionY: number,
    nodeId: string,
    inputIndex: number
  ) => void;
  onMouseLeaveInput: (nodeId: string, inputIndex: number) => void;
}

const NodeComponent: Component<NodeProps> = (props: NodeProps) => {
  function handleMouseEnterInput(ref: any, inputIndex: number) {
    props.onMouseEnterInput(centerX, centerY, props.id, inputIndex);
  }

  return (
    <div
      class={props.selected ? styles.nodeSelected : styles.node}
      style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
      onMouseDown={(event: any) => {
        // Prevent click on board
        event.stopPropagation();

        props.onMouseDownNode(props.id, event);
      }}
    >
      <div class={styles.inputsWrapper}>
        <For each={[...Array(Number(props.numberInputs)).keys()]}>
          {(_, index: Accessor<number>) => {
            let inputRef: any = null;
            return (
              <div
                ref={inputRef}
                class={styles.input}
                onMouseEnter={() => handleMouseEnterInput(inputRef, index())}
                onMouseLeave={() => handleMouseLeaveInput(index())}
              ></div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default NodeComponent;
