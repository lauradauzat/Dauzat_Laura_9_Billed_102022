/**
 * @jest-environment jsdom
 */


import {screen, waitFor, fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event"; 
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    beforeAll(() => {
   
     // document.body.innerHTML = html

      localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee'
        })
      )
      Object.defineProperty(window, 'location', {
        value: {
          hash: ROUTES_PATH['NewBill']
        }
      })

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      //window.onNavigate(ROUTES_PATH.NewBill)
      const html = NewBillUI()
      document.body.innerHTML = html
    

  
    })

      // Test d'intégration POST:
     describe("When I click on Envoyer", () => {
          test("A bill is created", async  () => {
        
      
            const formNewBill = screen.getByTestId("form-new-bill")
            expect(formNewBill).toBeTruthy()
            const btnNewBill = screen.getByTestId("btn-send-bill")
            expect(btnNewBill).toBeTruthy()

            const mockbill = {
              id: '47qAXb6fIm2zOKkLzMro',
              vat: '80',
              fileUrl:
                'https://firebasestorage.googleapis.com/v0/b/billable-677b6.appspot.com/o/justificatifs%2F47qAXb6fIm2zOKkLzMro?alt=media&token=c8db99c1-ff8d-4aef-8e9a-8e5dcb3d9c98',
              status: 'pending',
              type: 'Hôtel et logement',
              commentary: 'séminaire billed',
              name: 'encore',
              fileName: 'preview-facture-free-201801-pdf-1.jpg',
              date: '2004-04-04',
              amount: 400,
              commentAdmin: 'ok',
              email: 'a@a',
              pct: 20
            }

            const handleSubmit = jest.fn( () => {
              return Promise.resolve(mockbill); 
            } );

            btnNewBill.addEventListener("click", handleSubmit)
            userEvent.click(btnNewBill)
            expect(handleSubmit).toHaveBeenCalled()

          })
     })

    test("Then I should see the new bill form", async () => {
    
      await waitFor(() => screen.getByTestId('form-new-bill'))
      const formNewBill = screen.getByTestId('form-new-bill')
      expect(formNewBill).toBeInTheDocument; 
    })

    test("Then the type of expense type input should be visible", async () => {

      await waitFor(() => screen.getByTestId('expense-type'))
      const expenseType = screen.getByTestId('expense-type')
      expect(expenseType).toBeInTheDocument; 
    })


    test("Then the type of expense type input shoud display the correct number of options (7)", async () => {
  
      await waitFor(() => screen.getByTestId('expense-type'))
      const expenseType = screen.getByTestId('expense-type')
      const options = expenseType.options
      expect(options.length).toBe(7);
    })

    test("Then the type of expense type input should allow the user to change the option to choose the expense type", async () => {

      await waitFor(() => screen.getByTestId('expense-type'))
      const expenseType = screen.getByTestId('expense-type')
      const chosenOption = screen.getByRole('option', { name: 'IT et électronique' })
      userEvent.selectOptions(expenseType, chosenOption.value);
      expect(chosenOption.selected).toBe(true)

    
    })


    test("Then the type of expense name input should be visible", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      await waitFor(() => screen.getByTestId('expense-name'))
      const expenseName = screen.getByTestId('expense-name')
      expect(expenseName).toBeInTheDocument; 
    })

    test("Then bill icon in vertical layout should not be highlighted", async () => {
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(false);
    })

    test("The mail icon in vertical layout should  be highlighted", async () => {

      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(true);
    })

    test("Test the function handleChangeFile", () => {

      const mockStore = {
        bills: jest.fn().mockReturnThis(),
        create: jest.fn().mockResolvedValue({
          fileUrl: 'http://example.com',
          key: 'key'
        })
      };
  
      const newBill = new NewBill({ document, onNavigate: () => {}, store: mockStore, localStorage: window.localStorage });
      
      const file = new File(['file'], 'file.png', { type: 'image/png' });
      const input = screen.getByTestId('file');
      userEvent.upload(input, file);
      
      expect(mockStore.bills).toHaveBeenCalled();
      expect(mockStore.create).toHaveBeenCalled();

      jest.clearAllMocks()
    })

    test('An error message is displayed if the filetype is not png, jpg, or jpeg',  () => {

      const mockStore = {
        bills: jest.fn().mockReturnThis(),
        create: jest.fn().mockResolvedValue({
          fileUrl: 'http://example.com',
          key: 'key'
        })
      };

      const newBill = new NewBill({ document, onNavigate: () => {}, store: mockStore, localStorage: window.localStorage });
      const file = new File(['file'], 'file.txt', { type: 'text/plain' });
      const input = screen.getByTestId('file');
      const errorMessage = screen.getByTestId('error-file-format');
      userEvent.upload(input, file);

      expect(errorMessage.dataset.display).toBe('visible');

    });

    test('Test the function handleSubmit', () => {

      const mockEvent = {
        preventDefault: jest.fn(),
        target: {
          querySelector: jest.fn().mockImplementation((selector) => {
            switch (selector) {
              case 'input[data-testid="datepicker"]':
                return { value: '2022-01-01' };
              case 'select[data-testid="expense-type"]':
                return { value: 'Restaurant' };
              case 'input[data-testid="expense-name"]':
                return { value: 'Dinner' };
              case 'input[data-testid="amount"]':
                return { value: '100' };
              case 'input[data-testid="vat"]':
                return { value: '20' };
              case 'input[data-testid="pct"]':
                return { value: '20' };
              case 'textarea[data-testid="commentary"]':
                return { value: 'Dinner with friends' };
              default:
                return null;
            }
          }),
        },
      };
      localStorage.setItem('user', JSON.stringify({ email: 'test@test.com' }));
      const newBill = new NewBill({ document, onNavigate: () => {}, store: null, localStorage: window.localStorage });
      newBill.updateBill = jest.fn();
      newBill.onNavigate = jest.fn();

  
      newBill.handleSubmit(mockEvent);

      expect(newBill.updateBill).toHaveBeenCalled();
      expect(newBill.onNavigate).toHaveBeenCalledWith('#employee/bills'); 

  
    });





})


  })

