import {
  agHelper,
  dataSources,
  homePage,
} from "../../../../support/Objects/ObjectsCore";
import reconnectDSLocator from "../../../../locators/ReconnectLocators.js";

let workspaceId: string;

describe("Fork application with multiple datasources", function () {
  before("Creating all Datasources", () => {
    // Create Mongo DS and respective query
    dataSources.CreateDataSource("Mongo");
    dataSources.CreateQueryAfterDSSaved();
    // Create PostgreSQL DS and respective query
    dataSources.CreateDataSource("Postgres");
    dataSources.CreateQueryAfterDSSaved();
    // Create Mysql DS and respective query
    dataSources.CreateDataSource("MySql");
    dataSources.CreateQueryAfterDSSaved();
    // Create S3 DS
    dataSources.CreateDataSource("S3");
    dataSources.CreateQueryAfterDSSaved();
    dataSources.ValidateNSelectDropdown("Commands", "List files in bucket");
    agHelper.EnterValue("assets-test.appsmith.com", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Bucket name",
    });
  });

  it("1. Bug Id: 24708  - fork and test the forked application", function () {
    // Create a new workspace and fork application
    const appname: string = localStorage.getItem("AppName") || "randomApp";
    homePage.NavigateToHome();
    agHelper.GenerateUUID();
    cy.get("@guid").then((uid) => {
      workspaceId = "forkApp" + uid;
      homePage.CreateNewWorkspace(workspaceId);
      agHelper.PressEscape();
      cy.log("------------------" + workspaceId);
      homePage.ForkApplication(appname, workspaceId);
    });
    // In the forked application, reconnect all datasources
    dataSources.ReconnectDSbyName("MongoDBUri");
    dataSources.ReconnectDSbyName("PostgreSQL");
    dataSources.ReconnectDSbyName("MySQL");
    dataSources.ReconnectDSbyName("S3");

    // assert if the datasources are connected as expeced
    agHelper.AssertContains(
      "Your application is ready to use.",
      "exist",
      reconnectDSLocator.SuccessMsg,
    );
    homePage.AssertNCloseImport();
  });
});