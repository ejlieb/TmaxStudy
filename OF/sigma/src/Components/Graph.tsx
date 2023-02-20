import React, { FC, useEffect } from "react";
import data from '../Assets/Data/data.json'
import "@react-sigma/core/lib/react-sigma.min.css";
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";

export const MultiGraph: FC = () => {
  const MyGraph: FC = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
      // Create the graph
      const graph = new MultiDirectedGraph();
      graph.addNode("A", { x: 0, y: 0, label: "Node A", size: 10 });
      graph.addNode("B", { x: 1, y: 1, label: "Node B", size: 10 });
      graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });
      graph.addEdgeWithKey("rel2", "A", "B", { label: "REL_2" });
      graph.import(data);
      loadGraph(graph);
    }, [loadGraph]);

    return null;
  };

  return (
    <SigmaContainer
      graph={MultiDirectedGraph}
      style={{ height: "500px"}}
      settings={{ renderEdgeLabels: true, defaultEdgeType: "arrow" }}
    >
      <MyGraph/>
    </SigmaContainer>
  );
};

export default MultiGraph;