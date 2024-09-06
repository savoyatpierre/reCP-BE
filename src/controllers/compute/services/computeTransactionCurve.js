module.exports = function computeTransactionCurve(transactions, need) {
  let sinceDate = Date.parse(need.since);
  let nowDate = Date.now();
  let Difference_In_Time = nowDate - sinceDate;
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  let periods = Math.floor(Difference_In_Days / need.by);
  console.log("sinceDate", sinceDate);
  console.log("nowDate", nowDate);
  console.log("Difference_In_Time", Difference_In_Time);
  console.log("Difference_In_Days", Difference_In_Days);
  console.log("periods", periods);

  // Build curve
  let curve = {};
  for (let i = 0; i < periods; i++) {
    curve[i] = {
      total: 0,
      date: sinceDate + i * need.by * 1000 * 3600 * 24,
    };
  }

  // Totalise transactions
  transactions.forEach((transaction) => {
    let transactionDate = Date.parse(transaction.date);
    let Difference_In_Time = transactionDate - sinceDate;

    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let Period = Difference_In_Days / need.by;
    let slice = Math.floor(Period);

    if (Object.keys(curve).includes(slice)) {
      curve[slice].total = curve[slice].total + transaction.amount;
    } /*else {
      console.log("transactionDate", transactionDate);
      console.log("Difference_In_Time", Difference_In_Time);
      console.log("Difference_In_Days", Difference_In_Days);
      console.log("Period", Period);
      console.log("slice", slice);
    }*/
    //1694236574000
  });

  return curve;
};
