'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { UnitAccordion } from './UnitAccordion';
import { AddUnitDialog } from './AddUnitDialog';
import { AddLessonDialog } from './AddLessonDialog';
import {
  createUnit,
  updateUnit,
  deleteUnit,
  reorderUnits,
} from '@/features/instructor/curriculum-actions';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface Unit {
  id: number;
  course_id: number;
  title_ar: string;
  title_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  order_index: number;
  lessons?: any[];
}

interface CurriculumTabProps {
  courseId: number;
  initialUnits: Unit[];
}

export function CurriculumTab({ courseId, initialUnits }: CurriculumTabProps) {
  const t = useTranslations('instructor');
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [localUnits, setLocalUnits] = useState(initialUnits);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Sync with prop changes
  useEffect(() => {
    setLocalUnits(initialUnits);
  }, [initialUnits]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = localUnits.findIndex(item => item.id === active.id);
    const newIndex = localUnits.findIndex(item => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedUnits = arrayMove(localUnits, oldIndex, newIndex);

    // Optimistically update UI
    setLocalUnits(reorderedUnits);

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce: Save to DB after 800ms
    saveTimeoutRef.current = setTimeout(async () => {
      if (isSaving) return;

      setIsSaving(true);
      const unitIds = reorderedUnits.map(u => u.id);
      const result = await reorderUnits(courseId, unitIds);

      if (result.success) {
        toast.success(t('unitsReordered'));
        router.refresh();
      } else {
        toast.error(t('failedToSaveOrder'));
        // Revert on error
        setLocalUnits(initialUnits);
      }
      setIsSaving(false);
    }, 800);
  };

  // Handle create unit
  const handleCreateUnit = async (data: any) => {
    const result = await createUnit({
      courseId,
      titleAr: data.title_ar,
      titleEn: data.title_en,
      descriptionAr: data.description_ar,
      descriptionEn: data.description_en,
    });

    if (result.success) {
      toast.success(t('unitCreatedSuccessfully'));
      setShowAddUnit(false);
      router.refresh();
    } else {
      toast.error(result.error || t('failedToCreateUnit'));
      throw new Error(result.error);
    }
  };

  // Handle update unit
  const handleUpdateUnit = async (data: any) => {
    if (!editingUnit) return;

    const result = await updateUnit(editingUnit.id, {
      titleAr: data.title_ar,
      titleEn: data.title_en,
      descriptionAr: data.description_ar,
      descriptionEn: data.description_en,
    });

    if (result.success) {
      toast.success(t('unitUpdatedSuccessfully'));
      setEditingUnit(null);
      setShowAddUnit(false);
      router.refresh();
    } else {
      toast.error(result.error || t('failedToUpdateUnit'));
      throw new Error(result.error);
    }
  };

  // Handle delete unit
  const handleDeleteUnit = async (unitId: number) => {
    // Confirmation is handled in UnitAccordion component
    const result = await deleteUnit(unitId);

    if (result.success) {
      toast.success(t('unitDeletedSuccessfully'));
      router.refresh();
    } else {
      toast.error(result.error || t('failedToDeleteUnit'));
    }
  };

  // Handle add lesson
  const handleAddLesson = (unitId: number) => {
    setSelectedUnitId(unitId);
    setShowAddLesson(true);
  };

  // Handle edit unit
  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setShowAddUnit(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t('courseCurriculum')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('organizeCourseContent')}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUnit(null);
            setShowAddUnit(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addUnit')}
        </Button>
      </div>

      {/* Units List */}
      {initialUnits.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">{t('noUnitsYet')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('startBuildingCourse')}
            </p>
            <Button onClick={() => setShowAddUnit(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('createFirstUnit')}
            </Button>
          </div>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localUnits.map(u => u.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {localUnits.map(unit => (
                <UnitAccordion
                  key={unit.id}
                  unit={unit}
                  courseId={courseId}
                  onAddLesson={() => handleAddLesson(unit.id)}
                  onEditUnit={() => handleEditUnit(unit)}
                  onDeleteUnit={() => handleDeleteUnit(unit.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Unit Dialog */}
      <AddUnitDialog
        open={showAddUnit}
        onOpenChange={open => {
          setShowAddUnit(open);
          if (!open) setEditingUnit(null);
        }}
        onSubmit={editingUnit ? handleUpdateUnit : handleCreateUnit}
        initialData={
          editingUnit
            ? {
                title_ar: editingUnit.title_ar,
                title_en: editingUnit.title_en,
                description_ar: editingUnit.description_ar || '',
                description_en: editingUnit.description_en || '',
              }
            : undefined
        }
        mode={editingUnit ? 'edit' : 'create'}
      />

      {/* Add Lesson Dialog */}
      {selectedUnitId && (
        <AddLessonDialog
          open={showAddLesson}
          onOpenChange={setShowAddLesson}
          unitId={selectedUnitId}
          onSuccess={() => {
            setShowAddLesson(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
