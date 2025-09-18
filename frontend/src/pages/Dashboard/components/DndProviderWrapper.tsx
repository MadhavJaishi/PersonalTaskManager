import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import type { ReactNode } from 'react';

const DndProviderWrapper = ({ children }: { children: ReactNode }) => (
    <DndProvider backend={HTML5Backend}>
        {children}
    </DndProvider>
);

export default DndProviderWrapper;