UI transilition Prompt :

I have uploaded a folder reference_code containing the source code of a React prototype.
OBJECTIVE:
Port this exact application to (our codebase) Ruby on Rails 7 using Hotwire (Turbo + Stimulus).


I am uploading a folder called frontend_reference_only in project.specs.md/frontend_reference_only.
CONTEXT:
These files are from a React prototype. I want you to PORT this application to Ruby on Rails 7 (Hotwire).
DO NOT install React.
DO NOT use JSON APIs for the frontend.
YOUR MISSION:
Visual Translation (ERB Views):
Open App.tsx and the components/ folder. Copy the HTML structure and Tailwind CSS classes exactly.
The Sidebar component -> goes to layouts/application.html.erb
The BookListPanel component -> goes to books/index.html.erb
The DetailPanel component -> goes to books/show.html.erb
The CreateForm component -> goes to books/new.html.erb
Behavioral Translation (Hotwire):
In App.tsx, look at the viewState logic.
Notice how the Middle Panel swaps between List and Form, but the Right Panel (DetailPanel) stays visible?
Implement this in Rails using Turbo Frames. The Middle Panel and Right Panel must be separate frames so they can update independently.
Logic Translation (Service Object):
you already have proejcts specs.md/Business rules.md 
Port this TypeScript logic strictly into a Ruby Service Object called Books::EntryService.

OUTPUT:
Generate the Exact UI (of rails) Rails Controller, the Service Object, and the ERB Views. Ensure the Tailwind classes are identical to the React reference.(the hotwire).




-------------

optional
For the bsuness logic and back server ---refers proejcts.specs.md/business ruels.md,nodel or migrations.mds etc

