import {
  Accessor,
  Component,
  For,
  Setter,
  createSignal,
  onMount,
} from "solid-js";
import styles from "./styles.module.css";
import ButtonsComponent from "../ButtonsComponent";
import NodeComponent from "../NodeComponents";

interface Node {
  id: string;
  numberInputs: number;
  numberOutputs: number;
  prevPosition: {
    get: Accessor<{ x: number; y: number }>;
    set: Setter<{ x: number; y: number }>;
  };
  currPosition: {
    get: Accessor<{ x: number; y: number }>;
    set: Setter<{ x: number; y: number }>;
  };
}

const BoardComponent: Component = () => {
  const [grabbingBoard, setGrabbingBoard] = createSignal<boolean>(false);
  const [scale, setScale] = createSignal<number>(1);
  const [clickedPosition, setClickedPosition] = createSignal<{
    x: number;
    y: number;
  }>({ x: -1, y: -1 });
  const [selectedNode, setSelectedNode] = createSignal<string | null>(null);

  const [nodes, setNodes] = createSignal<Node[]>([]);

  onMount(() => {
    const boardElement = document.getElementById("board");

    if (boardElement) {
      boardElement.addEventListener(
        "wheel",
        (event) => {
          // Update scale
          setScale(scale() + event.deltaY * -0.002);

          // Restrict scale
          setScale(Math.min(Math.max(1, scale()), 2));

          // Apply scale transform
          boardElement.style.transform = `scale(${scale()})`;
          boardElement.style.marginTop = `${(scale() - 1) * 50}vh`;
          boardElement.style.marginLeft = `${(scale() - 1) * 50}vw`;
        },
        { passive: false }
      );
    }
  });

  function handleOnMouseDownBoard(event: any) {
    // Start grabbing board
    setGrabbingBoard(true);
    setClickedPosition({ x: event.x, y: event.y });
  }
  function handleOnMouseUpBoard(event: any) {
    setClickedPosition({ x: -1, y: -1 });

    // Stop grabbing board
    setGrabbingBoard(false);
  }
  function handleOnMouseMove(event: any) {
    // User clicked somewhere
    if (clickedPosition().x >= 0 && clickedPosition().y >= 0) {
      const deltaX = event.x - clickedPosition().x;
      const deltaY = event.y - clickedPosition().y;

      const boardWrapperElement = document.getElementById("boardWrapper");
      if (boardWrapperElement) {
        boardWrapperElement.scrollBy(-deltaX, -deltaY);
        setClickedPosition({ x: event.x, y: event.y });
      }
    }
  }

  function handleOnClickAdd(numberInputs: number, numberOutputs: number) {
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;

    const [nodePrev, setNodePrev] = createSignal<{ x: number; y: number }>({
      x: randomX,
      y: randomY,
    });
    const [nodeCurr, setNodeCurr] = createSignal<{ x: number; y: number }>({
      x: randomX,
      y: randomY,
    });

    setNodes([
      ...nodes(),
      {
        id: `node_${Math.random().toString(36).substring(2, 8)}`,
        numberInputs: numberInputs,
        numberOutputs: numberOutputs,
        prevPosition: { get: nodePrev, set: setNodePrev },
        currPosition: { get: nodeCurr, set: setNodeCurr },
      },
    ]);
  }

  function handleOnClickDelete() {}

  return (
    <div id="boardWrapper" class={styles.wrapper}>
      <ButtonsComponent
        showDelete={selectedNode() !== null}
        onClickAdd={handleOnClickAdd}
        onClickDelete={handleOnClickDelete}
      ></ButtonsComponent>
      <div
        id="board"
        class={grabbingBoard() ? styles.boardDragging : styles.board}
        onMouseDown={handleOnMouseDownBoard}
        onMouseUp={handleOnMouseUpBoard}
        onMouseMove={handleOnMouseMove}
      >
        <For each={nodes()}>
          {(node: Node) => (
            <NodeComponent
              id={node.id}
              x={node.currPosition.get().x}
              y={node.currPosition.get().y}
              numberInputs={node.numberInputs}
              numberOutputs={node.numberOutputs}
              selected={selectedNode() === node.id}
              onMouseDownNode={handeOnMouseDownNode}
              onMouseDownOutput={handeOnMouseDownOutput}
              onMouseEnterInput={handeOnMouseEnterInput}
              onMouseLeaveInput={handeOnMouseLeaveInput}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default BoardComponent;
