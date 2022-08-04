import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import InvoiceFromSection from '../components/InvoiceFromSection'
import styles from '../styles/Home.module.css'


import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { PDFExport } from '@progress/kendo-react-pdf';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import SignaturePad from 'react-signature-canvas'
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { format } from 'date-fns'

const Home: NextPage = () => {

  const [isdownloadbtnClick, setDownloadbtnClick] = useState(false);
  const [currencyType, setCurrencyType] = useState("$");
  const [images, setImages]: any = useState("/stroke-infotech-logo.svg");
  const [signatureImg, setSignatureImg]: any = useState("/stroke-infotech-logo.svg");
  const maxNumber = 69;
  const [data, setData] = useState([
    {
      // "billing_period": [],
      "billing_period_startDate": "",
      "billing_period_endDate": "",
      "dates": "",
      "item_name": '',
      "item_desc": '',
      "item_quantity": 0,
      "item_price": 0,
      "item_amount": 0,
      "item_delete": ""
    },
  ]);
  const [defaultVal, setUpdateValue] = useState(
    {
      "invoice": "Invoice",
      "company_name": "Stroke Infotech",
      // "company_address": "Shiv pooja, Rushitoya Society, BloodBankRoad, una 362560",
      "company_address": "217, Silver Square, opp. DipakSchool, Nikol, Ahmedabad, Gujarat 382350",
      "company_contact_number": 8460569854,
      "bill_to": "bill to",
      "client_name": "jiro doi",
      "client_address": "1954 Bloor Street West Toronto, ON, M6P 3K9 Canada",
      "client_email": "j_doi@expample.com",
      "client_contact_number": 4165551212,
      "invoice_number_title": "invoice :",
      "invoice_number": 14,
      "invoice_date_title": "invoice date :",
      "invoice_date": "2018-09-25",
      "invoice_pament_due_title": "payment Due :",
      "invoice_pament_due": "Upon receipt",
      "note": "It was great doing business with you."
    });

  const [columnName, setColumnName] = useState({
    "col": "Billing Period",
    "col1": "Services",
    "col2": "price",
    "col3": "Hour",
    "col4": "Amount"
  })

  const [formData, setFormData]: any = useState([]);
  const pdfExportComponent = React.useRef<PDFExport>(null);

  let sigCanvas = useRef({});

  /*   function trimmedDataURL(trimmedDataURL: any, arg1: null): [any, any] {
      throw new Error('Function not implemented.')
    } */

  const handleAllValues = (event: any) => {
    const { value, name } = event.target
    setUpdateValue({ ...defaultVal, [name]: value })
  }
  const handleTableHeadings = (event: any) => {
    const { value, name } = event.target
    setColumnName({ ...columnName, [name]: value })
  }

  const addRow = () => {
    setData([...data, {
      // "billing_period": [],
      "billing_period_startDate": "",
      "billing_period_endDate": "",
      "dates": "",
      "item_name": "",
      "item_desc": '',
      "item_quantity": 0,
      "item_price": 0,
      "item_amount": 0,
      "item_delete": ""
    }])
  }


  const handleTableData = (event: any, row: any, index: any) => {
  const { value, name } = event.target;
    setFormData([{ ...formData, [name]: value }])
    const updatedData = [...data];
    const item: any = { ...updatedData[index] };


    if (name === "item_name" || name === "item_desc" || name === "billing_period_startDate" || name === "billing_period_endDate") {
      item[name] = value;
      updatedData[index] = item;
      console.log("item", item)
    }
    else {
      item[name] = parseInt(value);
      updatedData[index] = item;

      if (name === "item_price") {
        const total = row.item_quantity * value
        item["item_amount"] = total;
        updatedData[index] = item;
      }
      if (name === "item_quantity") {
        const total = value * row.item_price
        item["item_amount"] = total;
        updatedData[index] = item;
      }
    }
    setData(updatedData)

  }

  const handleImages = (event: any) => {
    const file: any = event[0].data_url
    setImages(file);
  }
  const handleSignature = (event: any) => {
    const file: any = event[0].data_url
    setSignatureImg(file);
  }

  const deleteRow = (e: any, index: any) => {
    //soultion -2
    let ans = [...data]
    ans.splice(index, 1);
    console.log("ans", ans);
    setData(ans)
  }

  const exportPDFWithComponent = () => {
    setDownloadbtnClick(true)
    setTimeout(() => {
      if (pdfExportComponent.current) {
        pdfExportComponent.current.save();
        setTimeout(() => {
          setDownloadbtnClick(false);
        }, 5000)
      }
    }, 1000)
  }


  // calculate total
  const total = data.map((r) => r.item_amount)
  const sum = total.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  //file name
  const clientName = defaultVal.client_name.split(" ").join("-")
  console.log("client", clientName)
  const fileName = defaultVal.invoice_number + "-" + clientName + "-" + "invoice"
  console.log("fileName", fileName)


  const handleoptions = (e: any) => {
    setCurrencyType(e.target.value)
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='crossorigin' />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
        <link href='' />


      </Head>

      {/* <body> */}

      <div className='bg-page-background'>
        <PDFExport
          scale={0.8}
          paperSize="A4"
          //  margin="1cm"
          ref={pdfExportComponent}
          fileName={fileName}
        >
          {/* <div className='max-w-[210mm] min-h-[297mm] mx-auto shadow-card mb-2 bg-page'> */}

          <div className='max-w-[210mm] min-h-[297mm] mx-auto shadow-card mb-2 bg-page'>
            {/* <h1 className='border-2 border-rose-500'>Hello</h1> */}

            <div className='flex justify-between items-start border-b border-real-gray px-12 pt-14 pb-5' >
              <div className='w-2/4 pt-2'>
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


                      <div className="image-item">
                        <img src={images} alt="" />
                      </div>
                      <div className='w-full text-right'>
                        <button
                          className='my-2 edit-button'
                          style={isDragging ? { color: 'red' } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          <svg baseProfile="tiny" height="24px" id="Layer_1" version="1.2" viewBox="0 0 24 24" width="24px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M21.561,5.318l-2.879-2.879C18.389,2.146,18.005,2,17.621,2c-0.385,0-0.768,0.146-1.061,0.439L13,6H4C3.448,6,3,6.447,3,7  v13c0,0.553,0.448,1,1,1h13c0.552,0,1-0.447,1-1v-9l3.561-3.561C21.854,7.146,22,6.762,22,6.378S21.854,5.611,21.561,5.318z   M11.5,14.672L9.328,12.5l6.293-6.293l2.172,2.172L11.5,14.672z M8.939,13.333l1.756,1.728L9,15L8.939,13.333z M16,19H5V8h6  l-3.18,3.18c-0.293,0.293-0.478,0.812-0.629,1.289C7.031,12.969,7,13.525,7,13.939V17h3.061c0.414,0,1.108-0.1,1.571-0.29  c0.464-0.19,0.896-0.347,1.188-0.64L16,13V19z M18.5,7.672L16.328,5.5l1.293-1.293l2.171,2.172L18.5,7.672z" /></svg>
                          {/* <img src='/edit_icon.svg' /> */}
                        </button>
                      </div>

                    </div>
                  )}
                </ImageUploading>
                {/* <img src='stroke-infotech-logo.svg' /> */}
              </div>
              <div className='w-2/4  company-details '>

                <input type='text' placeholder='Invoice' name="invoice" value={defaultVal.invoice} /* style={{ paddingRight: isdownloadbtnClick ? "12px" : 0 }} */ className="invoice text-xl leading-9 break-normal uppercase mb-2 text-primary font-bold hover:bg-input-hover w-full text-right" onChange={handleAllValues} />
                <input type="text" name="company_name" value={defaultVal.company_name} /* style={{ paddingRight: isdownloadbtnClick ? "12px" : 0 }} */ className='company-name block text-xs text-primary w-full font-bold capitalize hover:bg-input-hover text-right' onChange={handleAllValues} />

                <textarea id="txtarea" name="company_address" value={defaultVal.company_address} className='address text-xs w-[75%] self-end flex mb-1 ml-auto text-secondary font-medium hover:bg-input-hover text-right resize-none hover:resize' onChange={handleAllValues} />
                <input type="number" name="company_contact_number" value={defaultVal.company_contact_number} /* style={{ paddingRight: isdownloadbtnClick ? "4px" : 0 }} */ className='mobile-number  block text-secondary w-full font-medium text-xs text-right hover:bg-input-hover' onChange={handleAllValues} />

              </div>
            </div>

            {/* second section */}
            <div className='flex justify-between items-start px-12 py-5 '>
              <div className='w-2/4'>
                <input type="text" name="bill_to" value={defaultVal.bill_to} className='uppercase w-full text-info font-bold text-xs hover:bg-input-hover' onChange={handleAllValues} />
                <input type="text" name="client_name" value={defaultVal.client_name} className='text-xs w-full text-primary font-bold capitalize hover:bg-input-hover' onChange={handleAllValues} />
                <textarea rows={2} name="client_address" value={defaultVal.client_address} className='text-xs w-3/5 py-1 text-secondary font-medium hover:bg-input-hover resize-none hover:resize' onChange={handleAllValues} />
                <input type="email" name="client_email" value={defaultVal.client_email} className='text-secondary w-full font-medium text-xs block hover:bg-input-hover' onChange={handleAllValues} />
                <input type="number" name="client_contact_number" value={defaultVal.client_contact_number} className='text-secondary w-full font-medium text-xs block hover:bg-input-hover' onChange={handleAllValues} />
              </div>

              <div className='w-2/4'>
                <table className='ml-auto table-fixed'>
                  <tbody id="rel">
                    <tr className='leading-4 font-bold'>
                      <td className='p-0'>
                        <input type="text" name="invoice_number_title" value={defaultVal.invoice_number_title} className='text-right hover:bg-input-hover capitalize text-primary font-bold text-xs' onChange={handleAllValues} /></td>
                      <td className='pl-2'>
                        {isdownloadbtnClick ?
                          <span className="text-secondary font-medium text-xs inline-flex prefix"># <span className="input text-secondary font-medium text-xs min-w-[15px]" role="textbox" contentEditable onChange={handleAllValues}>{defaultVal.invoice_number}</span></span>
                          : <> <span className="text-secondary font-medium text-xs inline-flex prefix">#
                            <input type="text" name="invoice_number" value={defaultVal.invoice_number} className=' min-w-[10px] hover:bg-input-hover text-secondary font-medium text-xs' onChange={handleAllValues} />
                          </span> </>}
                      </td>
                    </tr>
                    <tr className='leading-4'>
                      <td><input type="text" name="invoice_date_title" value={defaultVal.invoice_date_title} className='text-right hover:bg-input-hover text-primary font-bold text-xs capitalize text-right' onChange={handleAllValues} /></td>
                      {isdownloadbtnClick ?
                        <span className="input text-secondary font-medium text-xs min-w-[15px]" role="textbox" contentEditable>{defaultVal.invoice_date}</span>
                        : <td className='pl-2'><input type="date" name="invoice_date" value={defaultVal.invoice_date} className='min-w-[10px] hover:bg-input-hover text-secondary font-medium text-xs' onChange={handleAllValues} /></td>
                      }</tr>
                    <tr className='leading-4'>
                      <td className='text-primary font-semibold text-xs capitalize text-right'><input type="text" name="invoice_pament_due_title" value={defaultVal.invoice_pament_due_title} className='text-right hover:bg-input-hover text-primary font-bold text-xs capitalize text-right' onChange={handleAllValues} /></td>
                      {isdownloadbtnClick ?
                        <span className="input text-secondary font-medium text-xs min-w-[15px]" role="textbox" contentEditable>{defaultVal.invoice_pament_due}</span>
                        : <td className=' pl-2'><input type="text" name="invoice_pament_due" value={defaultVal.invoice_pament_due} className='min-w-[10px] hover:bg-input-hover text-secondary font-medium text-xs' onChange={handleAllValues} /></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* third section */}
            {
              isdownloadbtnClick ? "" :
                <div className='flex py-2 px-12 justify-end'>
                  <form action="/action_page.php">
                    <label className='text-secondary font-bold text-xs mr-1'>Select currency:</label>
                  
                    <select className="currency-selector text-secondary font-bold text-xs" onChange={handleoptions} >
                      <option value="$" className='text-secondary font-bold text-xs'>USD</option>
                      <option value="£" className='text-secondary font-bold text-xs' >GBP</option>
                      <option value="¥" className='text-secondary font-bold text-xs'>JPY</option>
                      <option value="$" className='text-secondary font-bold text-xs'>CAD</option>
                      <option value="€" className='text-secondary font-bold text-xs'>EUR</option>
                      <option value="$" className='text-secondary font-bold text-xs'>AUD</option>
                    </select>
                    
                  </form>
                </div>
            }

            <div className='px-12'>
              <table className='table-fixed w-full text-left'>
                <thead className='border-y border-real-gray'>
                  <tr>
                    <th className='py-2 w-[25%]' ><input type="text" name="col" value={columnName.col} className='block hover:bg-input-hover capitalize w-full text-left text-primary font-bold text-xs leading-3' onChange={handleTableHeadings} /></th>
                    <th className='py-2 w-[45%]'><input type="text" name="col1" value={columnName.col1} className='block hover:bg-input-hover capitalize w-full text-primary font-bold text-xs leading-3' onChange={handleTableHeadings} /></th>
                    <th className='py-2 w-[10%]'><input type="text" name="col2" value={columnName.col2} className='block hover:bg-input-hover capitalize text-left  w-full text-primary font-bold text-xs leading-3' onChange={handleTableHeadings} /></th>
                    <th className='py-2 w-[10%]'><input type="text" name="col3" value={columnName.col3} className='block hover:bg-input-hover capitalize w-full text-left text-primary font-bold text-xs leading-3' onChange={handleTableHeadings} /></th>
                    <th className='py-2 w-[10%]'><input type="text" name="col4" value={columnName.col4} className='block hover:bg-input-hover capitalize w-full text-left text-primary font-bold text-xs leading-3' onChange={handleTableHeadings} /></th>
                  </tr>
                </thead>
                <tbody className='my-4' id='mytbody'>
                  {/* <tr><td> </td></tr> */}
                  {data.length !== 0 ?
                    data.map((row, index) =>

                      <tr key={index} id={index.toString()} className="py-4 my-2">
                       {isdownloadbtnClick && (row.item_name || row.item_desc) === "" ? "" : <> 
                          <td className='pr-2 w-[25%] align-top items-start'>
                            {isdownloadbtnClick && row.billing_period_startDate !== "" && row.billing_period_endDate !=="" ?
                              // isdownloadbtnClick && row.billing_period_startDate === "" && row.billing_period_endDate === "" ? <p>-</p>:
                            //  <p className="text-secondary font-medium text-xs block">{new Date(row?.billing_period_startDate).toLocaleDateString()}- {new Date(row?.billing_period_endDate).toLocaleDateString()}</p>

                             <p className="text-secondary font-medium text-xs block">{row.billing_period_startDate === "" ? "-" :new Date(row?.billing_period_startDate).toLocaleDateString()}- {row.billing_period_endDate === "" ? "" :new Date(row?.billing_period_endDate).toLocaleDateString()}</p>
                  
                             : <>

                                {/* <p> {new Date(row.billing_period_startDate)}-{new Date(row.billing_period_endDate)}</p> */}
                                <input type="date" data-date="" data-date-format="DD MMMM YYYY" multiple name="billing_period_startDate" value={row.billing_period_startDate} className='block text-secondary font-medium text-xs' onChange={(e) => { handleTableData(e, row, index) }} />
                                <input type="date" data-date="" data-date-format="DD MMMM YYYY" name="billing_period_endDate" value={row.billing_period_endDate} className='block text-secondary font-medium text-xs' onChange={(e) => { handleTableData(e, row, index) }} />
                              </>}
                            {/*  <DatePicker
                              range
                              calendarPosition="top-left"
                              fixMainPosition
                              name="dates"
                              value={dates}
                              minDate={new DateObject().toFirstOfMonth()}
                              maxDate={new DateObject().toLastOfMonth()}
                              onChange={dateObjects => {
                               setDates(dateObjects)
                               setAllDates(getAllDatesInRange(dateObjects))
                             }} 
                            
                            /> */}

                          </td>
                          <td className='py-1 w-[45%] pl-1 items-start'>
                            {isdownloadbtnClick && row.item_name === "" ? "" :
                              <textarea rows={1} name="item_name" style={{ width: isdownloadbtnClick ? "345.85px" : "100%" }} placeholder="Enter Item title" value={row.item_name} className='item_name block hover:bg-input-hover  resize-none hover:resize  leading-4 text-primary font-bold text-xs' onChange={(e) => { handleTableData(e, row, index) }} />
                             } 
                             {isdownloadbtnClick && row.item_desc === "" ? "" : 
                              isdownloadbtnClick ? <p className='item_desc hover:bg-input-hover w-full resize-none hover:resize leading-4 text-xs text-secondary font-medium'>{row.item_desc}</p> : ""}
                              <textarea name="item_desc" style={{ width: isdownloadbtnClick ? "345.85px" : "100%" }} placeholder="Enter Item description" value={row.item_desc} className='item_desc hover:bg-input-hover w-full resize-none hover:resize leading-4 text-xs text-secondary font-medium' onChange={(e) => { handleTableData(e, row, index) }} />
                             {/* }  */}
                          </td>
                          <td className='py-1 w-[10%] align-top items-start text-secondary font-medium text-xs text-left'>{isdownloadbtnClick && row.item_price === 0 ? <input type="text" value="-" className='text-left text-secondary font-medium text-xs' />
                            : <>{/*  <span className='absolute '>{currencyType}</span>  */}
                              <span className='w-full text-secondary font-medium text-xs inline-flex '>{currencyType} <input type="number" name="item_price" value={row?.item_price} className='item_price hover:bg-input-hover w-full text-left text-secondary font-medium text-xs block' onChange={(e) => { handleTableData(e, row, index) }} /> </span> </>
                          }</td>

                          <td className='py-1 w-[10%] align-top text-secondary font-medium text-xs text-left'>{isdownloadbtnClick && row.item_quantity === 0 ? <input type="text" value="-" className='text-left text-secondary font-medium text-xs' />
                            : <input type="number" name="item_quantity" value={row?.item_quantity} className=' hover:bg-input-hover w-full text-left text-secondary font-medium text-xs' onChange={(e) => { handleTableData(e, row, index) }} />
                          }</td>

                          <td className='py-1 w-[10%] align-top text-secondary font-medium text-xs relative text-left relatve'>{isdownloadbtnClick && row.item_amount === 0 ? <input type="text" value="-" className='text-left text-secondary font-medium text-xs' /> :
                            <><span className='text-secondary font-medium text-xs inline-flex '>{currencyType}<input type="number" name="item_amount" value={row?.item_amount} className='item_amount hover:bg-input-hover w-full text-left text-secondary font-medium text-xs' onChange={(e) => { handleTableData(e, row, index) }} /></span></>
                          }
                            <button className='flex delete-button block absolute right-[-20px] top-[16px]' onClick={(e) => { deleteRow(e, index) }}><img id={index.toString()} src="/delete.svg" width={15} height={15} /></button>
                          </td>
                         </>} 
                      </tr>

                    ) : ""

                  }
                  <tr className='border-b-2 border-real-gray'> <td><button className='flex add-button items-center capitalize text-secondary font-medium text-xs mb-1' onClick={addRow}><img src="/add_icon.svg" className='mr-2' width={15} height={15} />add item</button></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td> <input type="text" disabled value="Total:" className=' text-primary py-3 font-bold text-xs text-left bg-disabled ' /></td>
                    <td>
                      {isdownloadbtnClick && sum === 0 ? <input type="text" className='w-[10%] text-primary w-1/5 py-3 font-bold text-xs text-left bg-disabled ' value="-" />
                        : <> <span className="inline-flex font-bold text-xs text-primary items-center">{currencyType} <input type="number" disabled className='sum w-[10%] text-primary w-28 py-3 font-bold text-xs text-left bg-disabled ' placeholder="-" value={sum} /></span></>
                        // : <> <span className="inline-flex font-bold text-xs text-primary items-center">{currencyType} <input type="number" disabled className='sum text-primary w-28 py-3 font-bold text-xs text-left bg-disabled ' placeholder="-" value={sum} /></span></>
                      }</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
                    <img src={signatureImg} className="w-[100px] ml-auto" alt="" />
                  </div>
                  <div className='w-full text-center max-w-[20%] ml-auto text-right'>
                    <button
                      className='my-2 edit-button'
                      style={isDragging ? { color: 'red' } : undefined}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <svg /* className='fill-white hover:fill-black' */ baseProfile="tiny" height="24px" id="Layer_1" version="1.2" viewBox="0 0 24 24" width="24px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M21.561,5.318l-2.879-2.879C18.389,2.146,18.005,2,17.621,2c-0.385,0-0.768,0.146-1.061,0.439L13,6H4C3.448,6,3,6.447,3,7  v13c0,0.553,0.448,1,1,1h13c0.552,0,1-0.447,1-1v-9l3.561-3.561C21.854,7.146,22,6.762,22,6.378S21.854,5.611,21.561,5.318z   M11.5,14.672L9.328,12.5l6.293-6.293l2.172,2.172L11.5,14.672z M8.939,13.333l1.756,1.728L9,15L8.939,13.333z M16,19H5V8h6  l-3.18,3.18c-0.293,0.293-0.478,0.812-0.629,1.289C7.031,12.969,7,13.525,7,13.939V17h3.061c0.414,0,1.108-0.1,1.571-0.29  c0.464-0.19,0.896-0.347,1.188-0.64L16,13V19z M18.5,7.672L16.328,5.5l1.293-1.293l2.171,2.172L18.5,7.672z" /></svg>
                      {/* <img src='/edit_icon.svg' /> */}
                    </button>
                  </div>

                </div>
              )}
            </ImageUploading>
            {/*               <div className=' my-4 px-12'>
                <SignaturePad penColor='black'
                  ref={sigCanvas}
                  canvasProps={{ width: 500, height: 200, className: 'signatureCanvas' }}

                />
              </div>
              <div className='text-center my-4'>
                <button className='text-center border text-center border-slate-100 p-2 mt-15 mb-15 font-medium text-sm bg-button-bg text-button-text' onClick={clearSignature}>Clear</button>
                <button className='text-center border text-center border-slate-100 p-2 mt-15 mb-15 font-medium text-sm bg-button-bg text-button-text' onClick={saveSignature}>Save</button>
              </div> */}

            {/* </>} */}
            {/* <div className='my-4 px-12 w-[40%] ml-auto' >
              {trimURL ? (
                <img src={trimURL} alt="mysignature" style={{
                  display: "block",
                  marginLeft: "auto",
                  width: "100px",

                }}
                />
              ) : null}
            </div> */}
            <div className='px-12 w-full my-6 py-4'>
              <textarea rows={1} value={defaultVal.note} name="note" onChange={handleAllValues} className="p-2 w-full border border-real-gray text-center text-secondary font-bold text-xs" />
            </div>


          </div>
        </PDFExport>

        <div className='flex justify-center w-full my-2.5'>
          <button type='submit' onClick={exportPDFWithComponent} className="text-center border text-center border-slate-100 p-2 mt-15 mb-15 font-medium text-sm bg-button-bg text-button-text">Download</button>
        </div>

      </div>
      

      
      {/* <InvoiceFromSection /> */}



      {/* </body> */}
    </div>
  )
}

export default Home


