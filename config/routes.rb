Rails.application.routes.draw do
  resources :books do
    get :by_isbn, on: :collection
  end
  root "books#index"
end
