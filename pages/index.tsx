import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange, Calendar } from "react-date-range";
import React, { useState, useRef, forwardRef, useEffect } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { format } from "date-fns";


const Home: NextPage = () => {
  const [isOpenDateRange, setOpenDateRange] = useState(null);
  const [isOpenCalander, setOpenCalander] = useState(false);

  const [invoiceDate, setInvoiceDate]: any = useState(null);
  const [isdownloadbtnClick, setDownloadbtnClick] = useState(false);
  const [currencyType, setCurrencyType] = useState("dollar-sign-svgrepo-com (2).svg");
  const [images, setImages]: any = useState("/stroke-infotech-logo.svg");
  const [signatureImg, setSignatureImg]: any = useState(
    "/stroke-infotech-logo.svg"
  );
  const [getDates, setDates] = useState([
    {
      // startDate: new Date(),
      // endDate: null,
      startDate: null,
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [data, setData] = useState([
    {
      billing_period: "",
      item_name: "",
      item_desc: "",
      item_quantity: "",
      item_price: "",
      item_amount: "",
      item_delete: "",
    },
  ]);
  const [defaultVal, setUpdateValue] = useState({
    invoice: "Invoice",
    company_name: "Stroke Infotech",
    company_address:
      "217, Silver Square, opp. Dipak School, Nikol, Ahmedabad, Gujarat 382350",
    company_contact_number: 8460569854,
    bill_to: "bill to",
    client_name: "jiro doi",
    client_address: "1954 Bloor Street West Toronto, ON, M6P 3K9 Canada",
    client_email: "j_doi@expample.com",
    client_contact_number: 4165551212,
    invoice_number_title: "invoice :",
    invoice_number: 14,
    invoice_date_title: "invoice date :",
    invoice_date: "2018-09-25",
    invoice_pament_due_title: "payment Due :",
    invoice_pament_due: "Upon receipt",
    note: "It was great doing business with you.",
  });

  const [columnName, setColumnName] = useState({
    col: "Billing Period",
    col1: "Services",
    col2: "price",
    col3: "Hour",
    col4: "Amount",
  });

  const pdfExportComponent = React.useRef<PDFExport>(null);
  const maxNumber = 69;

  const handleAllValues = (event: any) => {
    const { value, name } = event.target;

    setUpdateValue({ ...defaultVal, [name]: value });
  };
  const handleTableHeadings = (event: any) => {
    const { value, name } = event.target;
    setColumnName({ ...columnName, [name]: value });
  };

  const addRow = () => {
    setData([
      ...data,
      {
        billing_period: "",
        item_name: "",
        item_desc: "",
        item_quantity: "",
        item_price: "",
        item_amount: "",
        item_delete: "",
      },
    ]);
  };

  const handleTableData = (event: any, row: any, index: any) => {
    if (event.selection) {
      console.log("event", event.selection);
      const updatedData = [...data];
      const item: any = { ...updatedData[index] };
      const start = format(event.selection.startDate, "dd/MM/yyyy");
      const end = format(event.selection.endDate, "dd/MM/yyyy");

      // const startnew =format(start, 'dd/MM/yyyy')
      console.log("start", start);

      let bothdate: any = start + " - " + end;
      item["billing_period"] = bothdate;
      updatedData[index] = item;
      setData(updatedData);

      const newDateData = [...getDates];
      const dataitem = { ...newDateData[index] };
      dataitem["startDate"] = event.selection.startDate;
      dataitem["endDate"] = event.selection.endDate;
      newDateData[index] = dataitem;

      setDates(newDateData);
      setOpenDateRange(null);
    } else {
      const { value, name } = event.target;
      const updatedData = [...data];
      const item: any = { ...updatedData[index] };

      if (name === "item_name" || name === "item_desc") {
        item[name] = value;
        updatedData[index] = item;
      } else {
        item[name] = parseInt(value);
        updatedData[index] = item;

        if (name === "item_price") {
          const total = row.item_quantity * value;
          item["item_amount"] = total;
          updatedData[index] = item;
        }
        if (name === "item_quantity") {
          const total = value * row.item_price;
          item["item_amount"] = total;
          updatedData[index] = item;
        }
      }
      setData(updatedData);
    }
  };

  const handleImages = (event: any) => {
    const file: any = event[0].data_url;
    setImages(file);
  };
  const handleSignature = (event: any) => {
    const file: any = event[0].data_url;
    setSignatureImg(file);
  };

  const deleteRow = (e: any, index: any) => {
    //soultion -2
    let ans = [...data];
    ans.splice(index, 1);
    setData(ans);
  };

  const exportPDFWithComponent = () => {
    setDownloadbtnClick(true);
    setTimeout(() => {
      if (pdfExportComponent.current) {
        pdfExportComponent.current.save();
        setTimeout(() => {
          setDownloadbtnClick(false);
        }, 5000);
      }
    }, 1000);
  };

  const handleGetDates = (item: any) => {
    setDates([item.selection]);
  };

  // calculate total
  const total = data.map((r) => (r.item_amount !== "" ? r.item_amount : ""));
  const sum = total.reduce((accumulator: any, value: any) => {
    return accumulator + value;
  }, 0);

  //file name
  const temp = "invoice";
  const clientName = defaultVal.client_name.split(" ").join("-");
  const fileName =
    defaultVal.invoice_number +
    "-" +
    defaultVal.client_name.split(" ").join("-") +
    "-" +
    temp;

  const handleoptions = (e: any) => {
    console.log(typeof e.target.value);
    const currencyVar = e.target.value;
    setCurrencyType(e.target.value)

    
    console.log(currencyVar);
   /*  console.log(
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(502)
    ); */
    // setCurrencyType(currencyVar);
  };

  const handleKeyDown = (e: any) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const openDatePicker = (e: any, index: any) => {
    setOpenDateRange(index);
    if (isOpenDateRange === index) {
      setOpenDateRange(null);
    }
  };

  const openCalander = () => {
    setOpenCalander(!isOpenCalander);
  };

  const handleClose = () => {
    if (isOpenCalander === true) {
      setOpenCalander(false);
    }
    if (isOpenDateRange !== null) {
      setOpenDateRange(null);
    }
  };
  const curr: any = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(502);

  const Euro = <img src="euro-svgrepo-com.svg" />;
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>

          <meta name="description" content="Generated by create next app" />
          <meta http-equiv="content-type" content="text/html; charset=utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />

          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="crossorigin"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          ></link>
          <link href="" />
        </Head>
        {/* <xml version="1.0" encoding="UTF-8"></xml> */}
        {/* <body> */}

        <div className="bg-page-background py-8" onClick={handleClose}>
          <PDFExport
            scale={0.8}
            paperSize="A4"
            ref={pdfExportComponent}
            fileName={fileName}
          >
            {/* <div className='max-w-[210mm] min-h-[297mm] mx-auto shadow-card mb-2 bg-page'> */}

            <div className="max-w-[210mm] min-h-[297mm] mx-auto shadow-card mb-2 bg-page ">
              {/* <h1 className='border-2 border-rose-500'>Hello</h1> */}

              <div className="flex justify-between items-start border-b border-real-gray px-12 pt-14 pb-5">
                <div className="w-2/4 pt-1">
                  <ImageUploading
                    // multiple
                    value={images}
                    // name="emp_image_name"
                    onChange={handleImages}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                  >
                    {({
                      // imageList,
                      onImageUpload,
                      isDragging,
                      dragProps,
                    }) => (
                      // write your building UI
                      <div className="upload__image-wrapper max-w-[45%]">
                        <div className="w-full text-right">
                          <button
                            className="mb-2 edit-button fill-primary"
                            style={isDragging ? { color: "red" } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                          >
                            <svg
                              baseProfile="tiny"
                              height="24px"
                              id="Layer_1"
                              version="1.2"
                              viewBox="0 0 24 24"
                              width="24px"
                              xmlSpace="preserve"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                              <path d="M21.561,5.318l-2.879-2.879C18.389,2.146,18.005,2,17.621,2c-0.385,0-0.768,0.146-1.061,0.439L13,6H4C3.448,6,3,6.447,3,7  v13c0,0.553,0.448,1,1,1h13c0.552,0,1-0.447,1-1v-9l3.561-3.561C21.854,7.146,22,6.762,22,6.378S21.854,5.611,21.561,5.318z   M11.5,14.672L9.328,12.5l6.293-6.293l2.172,2.172L11.5,14.672z M8.939,13.333l1.756,1.728L9,15L8.939,13.333z M16,19H5V8h6  l-3.18,3.18c-0.293,0.293-0.478,0.812-0.629,1.289C7.031,12.969,7,13.525,7,13.939V17h3.061c0.414,0,1.108-0.1,1.571-0.29  c0.464-0.19,0.896-0.347,1.188-0.64L16,13V19z M18.5,7.672L16.328,5.5l1.293-1.293l2.171,2.172L18.5,7.672z" />
                            </svg>
                            {/* <img src='/edit_icon.svg' /> */}
                          </button>
                        </div>
                        <div className="image-item">
                          <img src={images} alt="" />
                        </div>
                      </div>
                    )}
                  </ImageUploading>
                  {/* <img src='stroke-infotech-logo.svg' /> */}
                </div>
                <div className="w-2/4  company-details ">
                  <input
                    type="text"
                    placeholder="Invoice"
                    name="invoice"
                    value={defaultVal.invoice}
                    /* style={{ paddingRight: isdownloadbtnClick ? "12px" : 0 }} */ className="invoice text-xl leading-9 break-normal uppercase mb-2 text-primary font-bold hover:bg-input-hover w-full text-right"
                    onChange={handleAllValues}
                  />
                  <input
                    type="text"
                    name="company_name"
                    value={defaultVal.company_name}
                    /* style={{ paddingRight: isdownloadbtnClick ? "12px" : 0 }} */ className="company-name block text-xs text-primary w-full font-bold capitalize hover:bg-input-hover text-right"
                    onChange={handleAllValues}
                  />

                  <textarea
                    id="txtarea"
                    rows={3}
                    name="company_address"
                    value={defaultVal.company_address}
                    className="address text-xs w-[75%] self-end flex mb-1 ml-auto text-secondary font-medium hover:bg-input-hover text-right resize-none hover:resize"
                    onChange={handleAllValues}
                    onKeyDown={handleKeyDown}
                  />
                  <input
                    type="text"
                    name="company_contact_number"
                    value={defaultVal.company_contact_number}
                    /* style={{ paddingRight: isdownloadbtnClick ? "4px" : 0 }} */ className="mobile-number  block text-secondary w-full font-medium text-xs text-right hover:bg-input-hover"
                    onChange={handleAllValues}
                  />
                </div>
              </div>

              {/* second section */}
              <div className="flex justify-between items-start px-12 py-5 ">
                <div className="w-2/4">
                  <input
                    type="text"
                    name="bill_to"
                    value={defaultVal.bill_to}
                    className="uppercase w-full text-info font-bold text-xs hover:bg-input-hover"
                    onChange={handleAllValues}
                  />
                  <input
                    type="text"
                    name="client_name"
                    value={defaultVal.client_name}
                    className="client_name text-xs w-full text-primary font-bold capitalize hover:bg-input-hover mb-1"
                    onChange={handleAllValues}
                  />
                  <textarea
                    rows={3}
                    name="client_address"
                    value={defaultVal.client_address}
                    className="text-xs w-3/5 py-1 text-secondary font-medium hover:bg-input-hover resize-none hover:resize"
                    onChange={handleAllValues}
                    onKeyDown={handleKeyDown}
                  />
                  <input
                    type="email"
                    name="client_email"
                    value={defaultVal.client_email}
                    className="text-secondary w-full font-medium text-xs block hover:bg-input-hover"
                    onChange={handleAllValues}
                  />

                  <input
                    type="text"
                    name="client_contact_number"
                    value={defaultVal.client_contact_number}
                    className="text-secondary w-full font-medium text-xs block hover:bg-input-hover"
                    onChange={handleAllValues}
                  />
                </div>

                <div className="w-2/4">
                  <table className="ml-auto table-fixed" id="invoice-details">
                    <tbody id="rel">
                      <tr className="leading-4 font-bold">
                        <td className="p-0">
                          <input
                            type="text"
                            name="invoice_number_title"
                            value={defaultVal.invoice_number_title}
                            className="text-right hover:bg-input-hover capitalize text-primary font-bold text-xs"
                            onChange={handleAllValues}
                          />
                        </td>
                        <td className="pl-1">
                          {isdownloadbtnClick ? (
                            <span className="text-secondary font-medium text-xs inline-flex prefix">
                              #{" "}
                              <span
                                className="input text-secondary font-medium text-xs min-w-[15px]"
                                role="textbox"
                                contentEditable
                                onChange={handleAllValues}
                              >
                                {defaultVal.invoice_number}
                              </span>
                            </span>
                          ) : (
                            <>
                              {" "}
                              <span className="max-w-[65%] text-secondary font-medium text-xs inline-flex prefix">
                                #
                                <input
                                  type="text"
                                  name="invoice_number"
                                  value={defaultVal.invoice_number}
                                  className=" min-w-[10px] hover:bg-input-hover text-secondary font-medium text-xs"
                                  onChange={handleAllValues}
                                />
                              </span>{" "}
                            </>
                          )}
                        </td>
                      </tr>
                      <tr className="leading-4">
                        <td>
                          <input
                            type="text"
                            name="invoice_date_title"
                            value={defaultVal.invoice_date_title}
                            className="text-right hover:bg-input-hover text-primary font-bold text-xs capitalize text-right"
                            onChange={handleAllValues}
                          />
                        </td>
                        {isdownloadbtnClick ? (
                          <span
                            className="input pl-1 text-secondary font-medium text-xs min-w-[15px]"
                            role="textbox"
                            contentEditable
                          >
                            {invoiceDate
                              ? format(invoiceDate, "dd/MM/yyyy")
                              : "-"}
                          </span>
                        ) : (
                          <td className="pl-1 relative">
                            <input
                              type="text"
                              name="invoice_date"
                              placeholder="Select date"
                              value={
                                invoiceDate !== null
                                  ? format(invoiceDate, "dd/MM/yyyy")
                                  : ""
                              }
                              className="relative max-w-[65%] hover:bg-input-hover text-secondary font-medium text-xs"
                              onChange={handleAllValues}
                              onClick={openCalander}
                              /* value={defaultVal.invoice_date} */
                            />

                            <img
                              src="/calendar.svg"
                              width="12px"
                              height="12px"
                              className="calender-icon absolute right-[80px] top-[6px] hover:cursor-pointer "
                              onClick={openCalander}
                            />
                            {isOpenCalander ? (
                              <Calendar
                                className="absolute right-[35px] top-[26px] z-10"
                                // onChange={handleAllValues}
                                onChange={(item) => {
                                  setInvoiceDate(item);
                                  setOpenCalander(false);
                                }}
                                date={invoiceDate}
                              />
                            ) : (
                              ""
                            )}

                            {/*  <input
                            type="date"
                            name="invoice_date"
                            value={defaultVal.invoice_date}
                            className="max-w-[65%] hover:bg-input-hover text-secondary font-medium text-xs"
                            onChange={handleAllValues}
                          /> */}
                          </td>
                        )}
                      </tr>
                      <tr className="leading-4">
                        <td className="text-primary font-semibold text-xs capitalize text-right">
                          <input
                            type="text"
                            name="invoice_pament_due_title"
                            value={defaultVal.invoice_pament_due_title}
                            className="text-right hover:bg-input-hover text-primary font-bold text-xs capitalize text-right"
                            onChange={handleAllValues}
                          />
                        </td>
                        {isdownloadbtnClick ? (
                          <span
                            className="input pl-1 text-secondary font-medium text-xs min-w-[15px]"
                            role="textbox"
                            contentEditable
                          >
                            {defaultVal.invoice_pament_due}
                          </span>
                        ) : (
                          <td className=" pl-1">
                            <input
                              type="text"
                              name="invoice_pament_due"
                              value={defaultVal.invoice_pament_due}
                              className="max-w-[65%] hover:bg-input-hover text-secondary font-medium text-xs"
                              onChange={handleAllValues}
                            />
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* third section */}
              {isdownloadbtnClick ? (
                ""
              ) : (
                // <div className="flex py-2 px-12 justify-end">
                <div className="flex py-2 px-12 justify-end">
                  <form action="/action_page.php" className="w-[22%]">
                    <label className="text-secondary font-bold text-xs pr-1">
                      Select currency:
                    </label>

                    <select
                      className="currency-selector w-[20%] text-secondary font-bold text-xs h-full border-real-gray"
                      onChange={handleoptions}
                    >
                      <option
                      //  value="/dollar-sign-svgrepo-com.svg"
                      //  value="/dollar-svgrepo-com.svg"
                      //  value="dollar-sign-svgrepo-com (2).svg"
                      value="iconmonstr-currency-3.svg"
                        className="text-secondary font-bold text-xs"
                      >
                        $
                      </option>
                      <option
                      value="iconmonstr-currency-10.svg"
                      // value="/british-pound-svgrepo-com.svg"
                        // value="/pound-svgrepo-com (1).svg"
                        className="text-secondary font-bold text-xs"
                      >
                        £
                      </option>

                      <option
                      value="iconmonstr-currency-6.svg"
                      // value="/euro-svgrepo-com (2).svg"
                        // value="/euro-svgrepo-com.svg"
                        className="text-secondary font-bold text-xs"
                      >
                        €
                      </option>
                      <option
                      value="/iconmonstr-currency-25.svg"
                        // value="/Indian-Rupee-symbol.svg"
                        // value="/currency-inr-bold-svgrepo-com.svg"
                        className="text-secondary font-bold text-xs"
                      >
                        ₹
                      </option>
                    </select>
                  </form>
                </div>
              )}

              <div className="px-12 min-h-[450px]">
                <table className="table-fixed w-full text-left" id="mythead">
                  <thead className="border-y border-real-gray">
                    <tr>
                      <th className=" w-[30%]">
                        <input
                          type="text"
                          name="col"
                          value={columnName.col}
                          className="block hover:bg-input-hover capitalize w-full text-left text-primary font-bold text-xs leading-3"
                          onChange={handleTableHeadings}
                        />
                      </th>
                      <th className=" w-[40%]">
                        <input
                          type="text"
                          name="col1"
                          value={columnName.col1}
                          className="block hover:bg-input-hover capitalize w-full text-primary font-bold text-xs leading-3"
                          onChange={handleTableHeadings}
                        />
                      </th>
                      <th className=" w-[10%]">
                        <input
                          type="text"
                          name="col2"
                          value={columnName.col2}
                          className="block hover:bg-input-hover capitalize text-left  w-full text-primary font-bold text-xs leading-3"
                          onChange={handleTableHeadings}
                        />
                      </th>
                      <th className=" w-[10%]">
                        <input
                          type="text"
                          name="col3"
                          value={columnName.col3}
                          className="block hover:bg-input-hover capitalize w-full text-left text-primary font-bold text-xs leading-3"
                          onChange={handleTableHeadings}
                        />
                      </th>
                      <th className=" w-[10%]">
                        <input
                          type="text"
                          name="col4"
                          value={columnName.col4}
                          className="block hover:bg-input-hover capitalize w-full text-left text-primary font-bold text-xs leading-3"
                          onChange={handleTableHeadings}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="my-4" id="mytbody">
                    {data.length !== 0
                      ? data.map((row, index) => (
                          <tr key={index} id={index.toString()}>
                            {isdownloadbtnClick &&
                            (row.item_name || row.item_desc) === "" ? (
                              ""
                            ) : (
                              <>
                                {/* w-[25%]  */}
                                <td className=" w-[30%] align-top items-start relative">
                                  {/*  <span><img
                                  src="/calendar.svg"
                                  width="12px"
                                  height="12px"
                                  className="order-2 hover:bg-input-hover hover:cursor-pointer" /> */}
                                  <input
                                    type="text"
                                    id={index.toString()}
                                    name="billing_period"
                                    placeholder="Select Dates"
                                    value={
                                      isdownloadbtnClick &&
                                      row.billing_period === ""
                                        ? "-"
                                        : row.billing_period
                                    }
                                    onClick={(e) => {
                                      openDatePicker(e, index);
                                    }}
                                    className=" hover:bg-input-hover w-full text-left text-secondary font-medium text-xs block"
                                  />
                                  {/* </span> */}
                                  <img
                                    src="/calendar.svg"
                                    width="12px"
                                    height="12px"
                                    className="calender-icon absolute right-[7px] top-[8px]  hover:cursor-pointer "
                                    onClick={(e) => {
                                      openDatePicker(e, index);
                                    }}
                                  />

                                  {isOpenDateRange === index ? (
                                    <DateRange
                                      className="border border-real-gray absolute z-10"
                                      editableDateInputs={true}
                                      name="billing_period"
                                      value={row.billing_period}
                                      onChange={(e) => {
                                        handleTableData(e, row, index);
                                      }}
                                      moveRangeOnFirstSelection={false}
                                      ranges={getDates}
                                    />
                                  ) : (
                                    ""
                                  )}

                                  {/* {isdownloadbtnClick ?
                              <p className="text-secondary font-medium text-xs block">{row.billing_period_startDate === "" ? "" : new Date(row?.billing_period_startDate).toLocaleDateString()}- {row.billing_period_endDate === "" ? "" : new Date(row?.billing_period_endDate).toLocaleDateString()}</p>
                              : <>
                                <input type="date" data-date="" data-date-format="DD MMMM YYYY" multiple name="billing_period_startDate" value={row.billing_period_startDate} className='block text-secondary font-medium text-xs' onChange={(e) => { handleTableData(e, row, index) }} />
                                <input type="date" data-date="" data-date-format="DD MMMM YYYY" name="billing_period_endDate" value={row.billing_period_endDate} className='block text-secondary font-medium text-xs' onChange={(e) => { handleTableData(e, row, index) }} />
                              </>} */}
                                </td>
                                <td className=" w-[40%] pl-1 items-start">
                                  {isdownloadbtnClick ? (
                                    row.item_name !== "" ? (
                                      <p className="item_name w-full block resize-none hover:resize leading-4 text-primary font-bold text-xs">
                                        {row.item_name}
                                      </p>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    <textarea
                                      rows={1}
                                      name="item_name"
                                      placeholder="Enter Item title"
                                      value={row.item_name}
                                      className="item_name w-full block hover:bg-input-hover resize-none hover:resize leading-4 text-primary font-bold text-xs"
                                      onChange={(e) => {
                                        handleTableData(e, row, index);
                                      }}
                                      onKeyDown={handleKeyDown}
                                    />
                                  )}

                                  {isdownloadbtnClick ? (
                                    row.item_desc !== "" ? (
                                      <p className="item_desc hover:bg-input-hover w-full resize-none hover:resize leading-4 text-xs text-secondary font-medium">
                                        {row.item_desc}
                                      </p>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    <textarea
                                      name="item_desc"
                                      placeholder="Enter Item description"
                                      value={row.item_desc}
                                      className="item_desc hover:bg-input-hover w-full resize-none hover:resize leading-4 text-xs text-secondary font-medium"
                                      onChange={(e) => {
                                        handleTableData(e, row, index);
                                      }}
                                      onKeyDown={handleKeyDown}
                                    />
                                  )}
                                </td>
                                <td className=" w-[10%] align-top items-start text-secondary font-medium text-xs text-left">
                                  {isdownloadbtnClick &&
                                  row.item_price === "" ? (
                                    <input
                                      type="text"
                                      value="-"
                                      className="text-left text-secondary font-medium text-xs"
                                    />
                                  ) : (
                                    <>
                                     
                                    <span className="w-full text-secondary font-medium text-xs inline-flex items-center">
                                        {/* {currencyType}{" "} */}
                                       
                                        <img src={currencyType} />
                                        <input
                                          type="number"
                                          name="item_price"
                                          value={`${row?.item_price}`}
                                          className="item_price hover:bg-input-hover w-full text-left text-secondary font-medium text-xs block"
                                          onChange={(e) => {
                                            handleTableData(e, row, index);
                                          }}
                                        />
                                      </span>
                                    </>
                                  )}
                                </td>

                                <td className=" w-[10%] align-top text-secondary font-medium text-xs text-left">
                                  {isdownloadbtnClick &&
                                  row.item_quantity === "" ? (
                                    <input
                                      type="text"
                                      value="-"
                                      className="text-left text-secondary font-medium text-xs"
                                    />
                                  ) : (
                                    <input
                                      type="number"
                                      name="item_quantity"
                                      value={row?.item_quantity}
                                      className=" hover:bg-input-hover w-full text-left text-secondary font-medium text-xs"
                                      onChange={(e) => {
                                        handleTableData(e, row, index);
                                      }}
                                    />
                                  )}
                                </td>

                                <td className=" w-[10%] align-top text-secondary font-medium text-xs relative text-left relatve">
                                  {isdownloadbtnClick &&
                                  row.item_amount === "" ? (
                                    <input
                                      type="text"
                                      value="-"
                                      className="text-left text-secondary font-medium text-xs"
                                    />
                                  ) : (
                                    <>
                                      <span className="text-secondary font-medium text-xs inline-flex items-center">
                                      <img src={currencyType} />
                                        <input
                                          type="number"
                                          name="item_amount"
                                          value={row?.item_amount}
                                          className="item_amount hover:bg-input-hover w-full text-left text-secondary font-medium text-xs"
                                          onChange={(e) => {
                                            handleTableData(e, row, index);
                                          }}
                                        />
                                      </span>
                                    </>
                                  )}
                                  <button
                                    className="flex delete-button block absolute right-[-20px] top-[7px]"
                                    onClick={(e) => {
                                      deleteRow(e, index);
                                    }}
                                  >
                                    <img
                                      id={index.toString()}
                                      src="/delete.svg"
                                      width={15}
                                      height={15}
                                    />
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      : ""}

                    <tr className="add-item border-b-2 border-real-gray ">
                      <td className="">
                        <button
                          className="flex add-button items-center capitalize text-secondary font-medium text-xs "
                          onClick={addRow}
                        >
                          <img
                            src="/add_icon.svg"
                            className="mr-2"
                            width={15}
                            height={15}
                          />
                          add item
                        </button>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="w-[10%]">
                        {" "}
                        <input
                          type="text"
                          disabled
                          value="Total:"
                          className="block w-full text-primary py-3 font-bold text-xs text-left bg-disabled "
                        />
                      </td>
                      <td className="w-[10%]">
                        {isdownloadbtnClick && sum === 0 ? (
                          <input
                            type="text"
                            className="w-[10%] text-primary w-1/5 py-3 font-bold text-xs text-left bg-disabled "
                            value="-"
                          />
                        ) : (
                          <>
                            {" "}
                            <span className="inline-flex font-bold text-xs text-primary items-center">
                            <img src={currencyType}  />
                           
                              <input
                                type="number"
                                disabled
                                className="sum w-full text-primary py-3 font-bold text-xs text-left bg-disabled "
                                placeholder="-"
                                value={sum}
                              />
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div /* className="absolute w-full bottom-[0px]"  */>
                {/* {isdownloadbtnClick ? "" : <> */}
                <ImageUploading
                  value={signatureImg}
                  onChange={handleSignature}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
                >
                  {({
                    // imageList,
                    onImageUpload,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper px-12 py-6">
                      <div className="image-signature max-w-[20%] ml-auto">
                        <img
                          src={signatureImg}
                          className="w-[100px] ml-auto"
                          alt=""
                        />
                      </div>
                      <div className="w-full text-center max-w-[20%] ml-auto text-right">
                        <button
                          className="my-2 edit-button fill-primary"
                          style={isDragging ? { color: "red" } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          <svg
                            baseProfile="tiny"
                            height="24px"
                            id="Layer_1"
                            version="1.2"
                            viewBox="0 0 24 24"
                            width="24px"
                            xmlSpace="preserve"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <path d="M21.561,5.318l-2.879-2.879C18.389,2.146,18.005,2,17.621,2c-0.385,0-0.768,0.146-1.061,0.439L13,6H4C3.448,6,3,6.447,3,7  v13c0,0.553,0.448,1,1,1h13c0.552,0,1-0.447,1-1v-9l3.561-3.561C21.854,7.146,22,6.762,22,6.378S21.854,5.611,21.561,5.318z   M11.5,14.672L9.328,12.5l6.293-6.293l2.172,2.172L11.5,14.672z M8.939,13.333l1.756,1.728L9,15L8.939,13.333z M16,19H5V8h6  l-3.18,3.18c-0.293,0.293-0.478,0.812-0.629,1.289C7.031,12.969,7,13.525,7,13.939V17h3.061c0.414,0,1.108-0.1,1.571-0.29  c0.464-0.19,0.896-0.347,1.188-0.64L16,13V19z M18.5,7.672L16.328,5.5l1.293-1.293l2.171,2.172L18.5,7.672z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </ImageUploading>

                <div className="px-12 w-full my-6 py-4">
                  <textarea
                    rows={1}
                    value={defaultVal.note}
                    name="note"
                    onChange={handleAllValues}
                    className="p-2 w-full border border-real-gray text-center text-secondary font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          </PDFExport>

          <div className="flex justify-center w-full my-2.5">
            <button
              type="submit"
              onClick={exportPDFWithComponent}
              className="text-center border text-center border-slate-100 p-2 mt-15 mb-15 font-medium text-sm bg-button-bg text-button-text"
            >
              Download
            </button>
          </div>
        </div>

        {/* <InvoiceFromSection /> */}

        {/* </body> */}
      </div>
    </>
  );
};

export default Home;
