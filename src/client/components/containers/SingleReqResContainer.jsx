import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as actions from "../../../../src/client/actions/actions.js";

import connectionController from "../../controllers/reqResController";
import RestRequestContent from "../display/RestRequestContent.jsx";
import GraphQLRequestContent from "../display/GraphQLRequestContent.jsx";
import GRPCRequestContent from "../display/GRPCRequestContent.jsx";
import ReqResCtrl from "../../controllers/reqResController";

const SingleReqResContainer = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const newRequestFields = useSelector(store => store.business.newRequestFields); 
  const newRequestStreams = useSelector(store => store.business.newRequestStreams); 

  const routerHistory = useHistory();
  const routeChange = (path) => { 
    routerHistory.push(path);
  }

  const {
    content,
    content: {
      id,
      graphQL,
      closeCode,
      protocol,
      request,
      response,
      connection,
      connectionType,
      isHTTP2,
      url,
      timeReceived,
      timeSent,
      rpc,
      service,
    },
    reqResUpdate,
    reqResDelete,
  } = props;
  const network = content.request.network;  

  const addHistoryToNewRequest = () => {
    
    let requestFieldObj = {};
    if (network === 'rest') {
      routeChange('/composer/rest');
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        restUrl: content.request.restUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
      }
    };
    if (network === 'ws') {
      routeChange('/composer/ws');
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method  || 'GET',
        protocol: content.protocol  || 'http://',
        url: content.url,
        wsUrl: content.request.wsUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
      }
    };
    if (network === 'graphQL') {
      routeChange('/composer/graphql');
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        gqlUrl: content.request.gqlUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
      }
    };
    if (network === 'grpc') {
      routeChange('/composer/grpc');
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        grpcUrl: content.request.grpcUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
      }
    };
    let headerDeeperCopy;
    if (content.request.headers) {
      headerDeeperCopy = JSON.parse(JSON.stringify(content.request.headers));
      headerDeeperCopy.push({
        id: content.request.headers.length + 1,
        active: false,
        key: '',
        value: '',
      })
    }
    let cookieDeeperCopy;
    if (content.request.cookies && !/ws/.test(protocol)) {
      cookieDeeperCopy = JSON.parse(JSON.stringify(content.request.cookies));
      cookieDeeperCopy.push({
        id: content.request.cookies.length + 1,
        active: false,
        key: '',
        value: '',
      })
    }
    const requestHeadersObj = {
      headersArr: headerDeeperCopy || [],
      count: headerDeeperCopy ? headerDeeperCopy.length : 1,
    }
    const requestCookiesObj = {
      cookiesArr: cookieDeeperCopy || [],
      count: cookieDeeperCopy ? cookieDeeperCopy.length : 1,
    }
    const requestBodyObj = {
      bodyType: content.request.bodyType || 'raw',
      bodyContent: content.request.body || '',
      bodyVariables: content.request.bodyVariables || '',
      rawType: content.request.rawType || 'Text (text/plain)',
      JSONFormatted: true,
      bodyIsNew: false,
    }
    dispatch(actions.setNewRequestFields(requestFieldObj));
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
    dispatch(actions.setNewRequestBody(requestBodyObj));

    // // for gRPC ===> NEED TO FILL OUT
    // if (content && content.gRPC) {
    //   const streamsDeepCopy = JSON.parse(JSON.stringify(content.streamsArr));
    //   const contentsDeepCopy = JSON.parse(JSON.stringify(content.streamContent));
    //   // construct the streams obj from passed in history content & set state in store
    //   const requestStreamsObj = {
    //     streamsArr: streamsDeepCopy,
    //     count: queryArr.length,
    //     streamContent: contentsDeepCopy,
    //     selectedPackage: content.selectedPackage,
    //     selectedRequest: content.selectedRequest,
    //     selectedService:  content.selectedService,
    //     selectedStreamingType: content.selectedStreamingType,
    //     initialQuery: content.initialQuery,
    //     queryArr: content.queryArr,
    //     protoPath: content.protoPath,
    //     services: content.services,
    //     protoContent: content.protoContent,
    //   }
    //   dispatch(actions.setNewRequestStreams(requestStreamsObj))
    // }
    // setSidebarTab('composer');
  }

  const removeReqRes = () => {
    connectionController.closeReqRes(id);
    reqResDelete(content);
  }
  
  return (
    <div className="m-3">
      {/* TITLE BAR */}
      <div className='is-flex cards-titlebar'>
        <div className={`is-flex-grow-1 is-${network} is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium`}>{request.method}</div>
        <div className='is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center is-justify-content-space-between'>
          <div className='is-flex is-align-items-center ml-2'>
            {url}
          </div>
          <div className='req-status mr-1 is-flex is-align-items-center'>
            { connection === "uninitialized" && <div className='connection-uninitialized' /> }
            { connection === "open" && <div className='connection-open' /> }
            { connection === "closed" && <div className='connection-closed' /> }
          </div>
        </div>
      </div>
      {/* VIEW REQUEST DETAILS / MINIMIZE */}
      {network !== 'ws' &&
        <div className='is-neutral-300 is-size-7 cards-dropdown minimize-card pl-3 is-flex is-align-items-center is-justify-content-space-between' 
          onClick={() => { setShowDetails(showDetails === false)}}
          >
          {showDetails === true &&
            "Hide Request Details"
          }
          {showDetails === false &&
            "View Request Details"
          }
          {showDetails === true &&
          <div 
            className="is-clickable is-primary-link mr-3" 
            onClick={addHistoryToNewRequest}
          >
            Copy to Composer
            
          </div>
          }
        </div>
        
      }
      {/* REQUEST ELEMENTS */}
      {showDetails === true &&
        <div className='is-neutral-200-box'>
          {network === 'rest' &&
            <RestRequestContent request={content.request}/>
          }
          {network === 'grpc' &&
            <GRPCRequestContent request={content.request} rpc={content.rpc} service={content.service}/>
          }
          {network === 'graphQL' &&
            <GraphQLRequestContent request={content.request}/>
          }
        </div>
      }
      {/* REMOVE / SEND BUTTONS */}
        <div className="is-flex">
          <button 
            className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 bl-border-curve"
            id={request.method}
            onClick={removeReqRes}
            >
            Remove
          </button>
          {/* SEND BUTTON */}
            {connection === "uninitialized" &&
              <button
                className="is-flex-basis-0 is-flex-grow-1 button is-primary-100 is-size-7 br-border-curve"
                onClick={() => {
                  ReqResCtrl.openReqRes(content.id);
                }}
                >
                Send
              </button>
            }
            {/* VIEW RESPONSE BUTTON */}
            {connection !== "uninitialized" &&
              <button
                className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 br-border-curve"
                onClick={() => {
                  dispatch(actions.saveCurrentResponseData(content));
                }}
                >
                View Response
              </button>
            }
        </div>

    </div>
  );
}
export default SingleReqResContainer;
