import { Alert, AppUiProvider } from "@canva/app-ui-kit";
import type {
  GetDataTableRequest,
  GetDataTableResponse,
  RenderSelectionUiRequest,
} from "@canva/intents/data";
import { prepareDataConnector } from "@canva/intents/data";
import { auth } from "@canva/user";
import { createRoot } from "react-dom/client";
import { buildDataTableResult, scope } from "./api";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";

const root = createRoot(document.getElementById("root") as Element);
prepareDataConnector({
  /**
   * Fetches structured data from an external source.
   *
   * This action is called in two scenarios:
   *
   * - During data selection to preview data before import (when {@link RenderSelectionUiRequest.updateDataRef} is called).
   * - When refreshing previously imported data (when the user requests an update).
   *
   * @param params - Parameters for the data fetching operation.
   * @returns A promise resolving to either a successful result with data or an error.
   */
  getDataTable: async (
    params: GetDataTableRequest,
  ): Promise<GetDataTableResponse> => {
    const oauth = auth.initOauth();
    const token = await oauth.getAccessToken({ scope });
    return buildDataTableResult(params, token?.token);
  },

  /**
   * Renders a UI component for selecting and configuring data from external sources.
   * This UI should allow users to browse data sources, apply filters, and select data.
   * When selection is complete, the implementation must call the `updateDataRef`
   * callback provided in the params to preview and confirm the data selection.
   *
   * @param request - parameters that provide context and configuration for the data selection UI.
   * Contains invocation context, size limits, and the updateDataRef callback
   */
  renderSelectionUi: async (request: RenderSelectionUiRequest) => {
    function render() {
      root.render(<App request={request} />);
    }

    render();

    if (module.hot) {
      module.hot.accept("./app", render);
      module.hot.accept("./api", render);
    }
  },
});

// TODO: Fallback message if you have not turned on the data connector intent.
// You can remove this once your app is correctly configured.
root.render(
  <AppUiProvider>
    {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
    <Alert tone="critical">
      If you're seeing this, you need to turn on the data connector intent in
      the Developer Portal for this app.
    </Alert>
  </AppUiProvider>,
);
