import React from "react";
import BigNumber from "bignumber.js";
import {
  makeStyles,
  Grid,
  Button,
  Hidden,
  Typography,
  Box,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { formatApy, formatDecimals } from "../../../../../helpers/format";
import styles from "./styles";
import HistoricalRateChart from "../../HistoricalRateChart/HistoricalRateChart";
import DisplayTags from "../../../../../components/vaultTags";
import Tooltip from "../../../../../components/Tooltip";
import question from "../../../../../images/question_filled.svg";
import vaultStates from "./vaultStates.json";

const historicalRateChartData = [
  { date: "28 Jan", apy: 5.0 },
  { date: "4 Feb", apy: 57.15 },
  { date: "11 Feb", apy: 38.5 },
  { date: "18 Feb", apy: 41.37 },
  { date: "28 March", apy: 95.0 },
  { date: "4 April", apy: 147.15 },
  { date: "11 April", apy: 115.5 },
  { date: "18 April", apy: 179.37 },
];

const useStyles = makeStyles(styles);

const PortfolioItem = ({ item }) => {
  const classes = useStyles({
    muted: item.status === "paused" || item.status === "eol",
  });
  const history = useHistory();

  const formatBalance = () => {
    const balance = new BigNumber(item.balance);
    return formatDecimals(balance.div("1e18"), 4, 6);
  };

  const ctaText = () => {
    if (item.depositsPaused === true) {
      return "Withdraw";
    } else {
      return "Deposit / Withdraw";
    }
  };

  const getTags = () => {
    if (item.depositsPaused) {
      if (item.status === "active") {
        return ["depositsPaused"];
      } else if (item.status === "paused") {
        return ["paused"];
      } else if (item.status === "eol") {
        return ["eol"];
      }
    } else {
      return [];
    }
  };

  return (
    <Grid
      container
      key={item.id}
      className={[classes.item, classes.roundedLeft, classes.roundedRight].join(
        " "
      )}
    >
      <Box flexGrow={1} textAlign="left">
        <Grid container>
          <Grid>
            <Box className={classes.title} textAlign={"left"}>
              <Typography className={classes.h2}>{item.name}</Typography>
              <Box display="flex" alignItems="center">
                <Typography display={"inline"}>
                  <img
                    alt={item.network}
                    src={
                      require("../../../../../images/networks/" +
                        item.network +
                        ".svg").default
                    }
                  />
                </Typography>
                <Box marginRight={0.5}>
                  <DisplayTags tags={getTags()} />
                </Box>
                {item.depositsPaused && (
                  <Tooltip
                    title={vaultStates[item.status].title}
                    description={vaultStates[item.status].description}
                    direction="left"
                  >
                    <img
                      alt="More info"
                      src={question}
                      className={classes.moreInfoIcon}
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.rWidth} textAlign={"left"}>
        <Typography className={classes.h2}>{formatBalance()} LP</Typography>
        <Typography className={classes.h3}>
          <span className={classes.bold}>$150</span> Total
        </Typography>
      </Box>
      <Hidden mdDown>
        <Box className={classes.rWidth} textAlign={"left"}>
          <Typography className={classes.h2}>0.050781 LP</Typography>
          <Typography className={classes.h3}>
            <span className={classes.bold}>$150</span> Deposited
          </Typography>
        </Box>
      </Hidden>
      <Box className={classes.rWidth} textAlign={"left"}>
        <Typography className={classes.h2}>0.050781 LP</Typography>
        <Typography className={classes.h3}>
          <span className={classes.bold}>$20</span> Yield
        </Typography>
      </Box>
      <Hidden smDown>
        <Box className={[classes.rWidth, classes.chart].join(' ')} textAlign={"center"}>
          <HistoricalRateChart chartData={historicalRateChartData} />
          <Typography className={classes.h3}>Daily historical rate</Typography>
        </Box>
      </Hidden>
      <Box className={classes.apyContainer}>
        <Box display="flex" justifyContent="center" alignItems="center">
          {item.status === "paused" || item.status === "eol" ? (
            <Typography variant="h1">0%</Typography>
          ) : (
            <Typography variant="h1">{formatApy(item.apy.totalApy)}</Typography>
          )}
          <Box marginLeft={1}>
            <Typography variant="h2">APY</Typography>
          </Box>
        </Box>
        <Box>
          <Button
            className={classes.cta}
            onClick={() => {
              history.push("/" + item.network + "/vault/" + item.id);
            }}
          >
            {ctaText()}
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default PortfolioItem;
