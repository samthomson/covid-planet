import React, { useEffect } from "react";
import * as d3 from "d3";

interface Props {
  width: number;
  height: number;
}

// export default class D3SVG extends React.Component<{}, {}> {

const D3SVG = ({ height, width }: Props) => {
  let svg: SVGSVGElement | null = null;

  //   constructor(props: Props) {
  //     super(props);
  //   }

  useEffect(() => {
    d3.select(svg)
      .append("circle")
      .attr("r", 5)
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "red");
  }, []);

  // return <>sam</>;
  return (
    <svg
      className="container"
      ref={(ref: SVGSVGElement) => (svg = ref)}
      width={width}
      height={height}
    ></svg>
  );
};

export default D3SVG;
