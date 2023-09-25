/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import  Bills  from '../containers/Bills.js'
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import '@testing-library/user-event';
import router from "../app/Router.js";
import userEvent from '@testing-library/user-event';
import mockStore from "../__mocks__/store"




describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    beforeAll(() => { 
      // try to DRY this shit
    })

    afterEach(() => {
      // Clean up the DOM and reset localStorage after each test

    });

    test("fetches bills from mock API GET", async () => {
      jest.mock("../app/store", () => mockStore)
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      const bills = await mockStore.bills().list()
      expect(bills).toBeTruthy()
    })


    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    })
    test("The mail icon in vertical layout should not be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(false);
    })
    test("Btn 'Nouvelle Note de Frais' should navigate to NewBill page", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const billsClass = new Bills({document, onNavigate, store: null, localStorage: window.localStorage})
      const handleClickNewBill = jest.fn(()=> billsClass.handleClickNewBill());
      const root = document.createElement("div") 
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
     document.body.innerHTML = BillsUI({ data: bills }) 
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const btnNewBill = screen.getByTestId('btn-new-bill')
      btnNewBill.addEventListener('click', handleClickNewBill); 
      userEvent.click(btnNewBill);
      expect(handleClickNewBill).toHaveBeenCalled();
    })
    describe("When I click on the eye icon", () => {

      test("Modal should have the class 'show'", async () => {
      

          const billsClass = new Bills(window, 'localStorage', { value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
          })); 

    
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.append(root)
          router()
          window.onNavigate(ROUTES_PATH.Bills)
          document.body.innerHTML = BillsUI({ data: bills }) 
          await waitFor(() => screen.getAllByTestId('icon-eye')); 
          const icons = screen.getAllByTestId('icon-eye'); 
          const firstIcon = icons[0]; 
          //const modal = screen.getByTestId('img-modal');
          const modaleFile = document.getElementById('modaleFile')
          $.fn.modal = jest.fn(() => modaleFile.classList.add('show'));

          const handleClickOnIconEye = jest.fn((icon) => billsClass.handleClickIconEye(icon));

          icons.forEach(icon => {
            icon.addEventListener("click", handleClickOnIconEye(icon));
            userEvent.click(icon);
            expect(handleClickOnIconEye).toHaveBeenCalled();
            expect(modaleFile.classList.contains('show')).toBe(true);
            })

          
          


      })

      test("Then handleClickOnIconEye function should be called", () => {
    
            // Create a mock icon with a data-bill-url attribute
          const mockIcon = document.createElement('div');
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname });
          };
          mockIcon.setAttribute('data-bill-url', 'http://example.com/bill.jpg');

        
          // Mock jQuery width and modal functions
        
          const widthMock = jest.fn(() => 800);
          const htmlMock = jest.fn();
          const modalMock = jest.fn();
          $ = jest.fn().mockReturnValue({
            width: widthMock,
            click: jest.fn(), 
            find: jest.fn().mockReturnValue({
              html: htmlMock,
            }),
            modal: modalMock,
          });

          // Create an instance of your class and call the method
          const billsClass = new Bills({document, onNavigate, store: null, localStorage: window.localStorage}); 
          const handleClickIconEye = jest.fn(()=> billsClass.handleClickIconEye(mockIcon));

          //billsClass.handleClickIconEye(mockIcon);
          mockIcon.addEventListener('click', handleClickIconEye); 
          
          userEvent.click(mockIcon);
          expect(handleClickIconEye).toHaveBeenCalled();

          // // Check that the html function was called with the correct argument
          expect(htmlMock).toHaveBeenCalledWith('<div style=\'text-align: center;\' class="bill-proof-container"><img width=400 src=http://example.com/bill.jpg alt="Bill" /></div>');

          // // Check that the modal function was called with 'show'
          expect(modalMock).toHaveBeenCalledWith('show');
      
      })

      test("Then html of the modal should be displayed", () => {
              // Create a mock icon with a data-bill-url attribute
              const mockIcon = document.createElement('div');
              const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
              };
              mockIcon.setAttribute('data-bill-url', 'http://example.com/bill.jpg');

            
              // Mock jQuery width and modal functions
              const $ = require('jquery');
              const widthMock = jest.fn(() => 800);
              const htmlMock = jest.fn();
              const modalMock = jest.fn();
              global.$ = jest.fn().mockReturnValue({
                width: widthMock,
                click: jest.fn(), 
                find: jest.fn().mockReturnValue({
                  html: htmlMock,
                }),
                modal: modalMock,
              });

              // Create an instance of your class and call the method
              const billsClass = new Bills({document, onNavigate, store: null, localStorage: window.localStorage}); 
              const handleClickIconEye = jest.fn(()=> billsClass.handleClickIconEye(mockIcon));

              //billsClass.handleClickIconEye(mockIcon);
              mockIcon.addEventListener('click', handleClickIconEye); 
              
              userEvent.click(mockIcon);
        

              // // Check that the html function was called with the correct argument
              expect(htmlMock).toHaveBeenCalledWith('<div style=\'text-align: center;\' class="bill-proof-container"><img width=400 src=http://example.com/bill.jpg alt="Bill" /></div>');

              // // Check that the modal function was called with 'show'
              // expect(modalMock).toHaveBeenCalledWith('show');
      })

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("the bills table should be empty", () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
      const table = screen.getByTestId('tbody');
      const tdElements = table.querySelectorAll('td');
      expect(tdElements.length).toBe(0);
    });

    test("the getBills function should return unformated date and the error if data is corrupted", () => {
        const corruptedBills = [{
        "status": "refused",
        "date": "unformatted date"
        }];

      const storeMock = {
        bills: () => {
          return {
            list: () => {
              return {
                then: (fn) => fn(corruptedBills),
              };
            },
          };
        },
      };
     
      const bills = new Bills({
        document,
        onNavigate: {},
        store: storeMock,
        localStorage: {},
      });
   
      const billError = bills.getBills();
      const expectedResult = [{ status: 'Refused', date: 'unformatted date' }];

      expect(billError).toEqual(expectedResult);
    });
  
    

  })


})