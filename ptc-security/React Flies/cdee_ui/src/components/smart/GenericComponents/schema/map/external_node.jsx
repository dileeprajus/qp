/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// import React from 'react';
// import { inject, observer } from 'mobx-react';
// import { dndWrapExternalSource } from 'react-sortable-tree';
// import { TextField, Thumbnail, Col, Button } from 'react-bootstrap';
// import SourceBox from '../dnd/SourceBox';
// // import withDragDropContext from '../../../../../lib/withDragDropContext';

// // FOR MORE INFORMATION AND HELP
// // REFER to https://github.com/fritz-c/react-sortable-tree/blob/master/src/node-renderer-default.js

// @inject('breadcrumb_store')
// @observer
// class ExternalNode extends React.Component {
//   constructor(props) {
//     super(props);


//     this.state = {
//       treeData: [],
//     };
//   }

//   componentWillMount() {
//     //   CODE HERE
//   }

//   render() {
//     return (
//       <div>
//         {/* {JSON.stringify(this.props.isSearchMatch)} */}
//         {/* <div style={{ overflow: 'hidden', clear: 'both', marginTop: '1.5rem' }}> */}
//         {/* <div style={{ float: 'left' }}> */}
//           <SourceBox showCopyIcon title={this.props.node.title} />
//         {/* </div> */}
//       {/* </div> */}
//       </div>
//     );
//   }
// }

// ExternalNode.propTypes = {
//   store: React.PropTypes.object,
// };

// export const externalNodeType = 'mapdrop';
// // export default ExternalNode;
// export default dndWrapExternalSource(ExternalNode, externalNodeType);
